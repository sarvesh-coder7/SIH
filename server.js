import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// =============================================================================
// CONFIGURATION — read .env variables with exact names
// =============================================================================

// Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

// SMTP Configuration
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASSWORD;
const senderEmail = process.env.SENDER_EMAIL || smtpUser;
const senderName = process.env.SENDER_NAME || 'JH Innovation Connect - Govt of Jharkhand';

const hasSmtp = Boolean(smtpUser && smtpPass);

// =============================================================================
// DIAGNOSTICS (never print secret values)
// =============================================================================
console.log('====================================================');
console.log('   JH INNOVATION CONNECT - API & AUTH SERVER');
console.log('====================================================');
console.log('• Supabase URL:     ', supabaseUrl ? '✓ Configured' : '✗ Missing');
console.log('• Supabase Key:     ', supabaseKey ? '✓ Configured' : '✗ Missing');
console.log('• SMTP Config:      ', hasSmtp ? `✓ Configured (${smtpUser})` : '✗ Not configured');
console.log('• Sender Email:     ', senderEmail || '(not set)');
console.log('====================================================');

// =============================================================================
// SUPABASE CLIENT
// =============================================================================
let supabase = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✓ Supabase client initialized');
  } catch (err) {
    console.error('✗ Supabase client init failed:', err.message);
  }
} else {
  console.warn('⚠️ Supabase not configured — user registration will fail.');
}

// =============================================================================
// EXPRESS APP
// =============================================================================
const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

const otpLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: { error: 'Too many OTP requests. Please wait a minute before trying again.' }
});

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many verify attempts. Please wait before trying again.' }
});

// =============================================================================
// NODEMAILER TRANSPORTER (SMTP)
// =============================================================================
let transporter = null;
let smtpVerified = false;
const fromAddress = senderEmail || smtpUser || 'no-reply@jharkhand.gov.in';

if (hasSmtp) {
  try {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    transporter.verify().then(() => {
      smtpVerified = true;
      console.log(`✓ SMTP connection verified (${smtpHost}:${smtpPort})`);
    }).catch((err) => {
      console.warn(`⚠️ SMTP verification failed: ${err.message}`);
      console.error('  ✗ OTP emails will not be delivered.');
    });
  } catch (e) {
    console.error('✗ SMTP transporter init failed:', e.message);
  }
} else {
  console.warn('⚠️ No email delivery configured. OTP emails cannot be sent.');
}

// =============================================================================
// OTP STORE (in-memory — suitable for local/hackathon)
// =============================================================================
const otpStore = new Map();

// =============================================================================
// EMAIL TEMPLATE
// =============================================================================
function buildOtpEmail(otp) {
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Verify your email address</title></head>
<body style="margin:0;padding:0;background:#F7F4EC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#10253D;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F7F4EC;padding:40px 10px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #E5E7EB;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
        
        <!-- TOP HEADER -->
        <tr><td align="center" style="padding:40px 30px 20px;">
          <!-- Jharkhand Logo placeholder, safely loaded or fallback text -->
          <div style="width:80px;height:80px;border-radius:50%;border:2px solid #0d5c3a;display:inline-block;line-height:80px;text-align:center;font-weight:bold;color:#0d5c3a;font-size:12px;margin-bottom:10px;">GOVT OF JH</div>
          <div style="font-size:12px;color:#10253D;font-weight:bold;">सत्यमेव जयते</div>
          <div style="height:2px;background:#C79A32;width:40px;margin:20px auto 0;"></div>
        </td></tr>
        
        <!-- MAIN CONTENT -->
        <tr><td style="padding:20px 40px 30px;background:#ffffff;">
          <h1 style="margin:0 0 24px;font-size:28px;color:#10253D;font-weight:bold;">Verify your email address</h1>
          <p style="font-size:16px;color:#10253D;margin:0 0 16px;line-height:1.5;">Hello,</p>
          <p style="font-size:16px;color:#10253D;margin:0 0 24px;line-height:1.5;">
            Thank you for registering with <strong>JH Innovation Connect</strong>.
          </p>
          <p style="font-size:16px;color:#10253D;margin:0 0 16px;line-height:1.5;">
            Use the following One-Time Password (OTP) to verify your email address:
          </p>
          
          <!-- OTP BOX -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FCF8ED;border:2px solid #C79A32;border-radius:12px;margin:20px 0;">
            <tr><td align="center" style="padding:24px 20px;">
              <p style="margin:0 0 12px;font-size:11px;font-weight:bold;color:#10253D;letter-spacing:2px;text-transform:uppercase;">Your Verification Code</p>
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="font-family:monospace;font-size:42px;font-weight:bold;letter-spacing:12px;color:#10253D;padding-right:20px;border-right:1px solid #E5E7EB;">${otp}</td>
                  <td style="padding-left:20px; vertical-align:middle; text-align:center; padding-top:6px;">
                    <a href="mailto:?subject=My%20JH%20Innovation%20Connect%20OTP&body=Your%20OTP%20is:%20${otp}" title="Share / Copy OTP" style="display:inline-block;cursor:pointer;text-decoration:none;">
                      <img src="https://img.icons8.com/fluency-systems-regular/48/10253D/copy.png" alt="Copy Icon" width="24" height="24" style="display:block;border:0;outline:none;" />
                    </a>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
          
          <!-- OTP EXPIRY -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 30px;">
            <tr>
              <td width="30" valign="top" style="padding-top:2px;">
                <div style="width:20px;height:20px;border-radius:50%;border:2px solid #C79A32;text-align:center;line-height:20px;color:#C79A32;font-size:14px;font-weight:bold;">L</div>
              </td>
              <td style="font-size:14px;color:#10253D;line-height:1.5;">
                This OTP is valid for 5 minutes. Please do not share this code with anyone.
              </td>
            </tr>
          </table>
          
          <!-- SECURITY INFORMATION -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F7F4EC;border-radius:8px;padding:20px;margin-bottom:24px;">
            <tr>
              <td width="50" valign="top">
                <div style="background:#F4E8C8;border-radius:50%;width:40px;height:40px;text-align:center;line-height:40px;">
                  <span style="color:#C79A32;font-weight:bold;">🔒</span>
                </div>
              </td>
              <td style="padding-left:16px;">
                <h3 style="margin:0 0 6px;font-size:14px;color:#10253D;font-weight:bold;">For your security</h3>
                <p style="margin:0;font-size:13px;color:#1B344F;line-height:1.5;">
                  Never share your OTP with anyone. JH Innovation Connect will never ask you to disclose your OTP by phone, message, or email.
                </p>
              </td>
            </tr>
          </table>
          
          <!-- UNREQUESTED EMAIL MESSAGE -->
          <p style="margin:0 0 20px;font-size:13px;color:#667085;line-height:1.5;">
            If you did not request this verification code, you can safely ignore this email.
          </p>
          <div style="height:1px;background:#E5E7EB;width:100%;"></div>
        </td></tr>
        
        <!-- FOOTER -->
        <tr><td align="center" style="padding:30px 40px;background:#F7F4EC;">
          <h4 style="margin:0 0 4px;font-size:14px;color:#10253D;font-weight:bold;">JH INNOVATION CONNECT</h4>
          <p style="margin:0 0 4px;font-size:12px;color:#1B344F;">Government of Jharkhand</p>
          <p style="margin:0 0 16px;font-size:12px;color:#1B344F;">Societal Innovation Collaboration Portal</p>
          <div style="height:2px;background:#C79A32;width:30px;margin:0 auto 16px;"></div>
          <p style="margin:0;font-size:11px;color:#667085;">© Government of Jharkhand. All rights reserved.</p>
        </td></tr>
        
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  const text = `Verify your email address\n\nHello,\n\nThank you for registering with JH Innovation Connect.\n\nUse the following One-Time Password (OTP) to verify your email address:\n\n${otp}\n\nThis OTP is valid for 5 minutes. Please do not share this code with anyone.\n\nIf you did not request this verification code, you can safely ignore this email.\n\n© Government of Jharkhand. All rights reserved.`;
  return { html, text };
}

// =============================================================================
// SEND EMAIL — uses SMTP
// =============================================================================
async function sendOtpEmail(toEmail, otp) {
  const subject = 'Verify your JH Innovation Connect account';
  const { html, text } = buildOtpEmail(otp);

  if (!transporter) {
    return { success: false, error: 'Email delivery is not configured on the server.' };
  }

  try {
    const info = await transporter.sendMail({
      from: { name: senderName, address: fromAddress },
      to: toEmail,
      subject,
      text,
      html,
    });
    if (!info.rejected || info.rejected.length === 0) {
      console.log(`✓ Email sent via SMTP to ${toEmail}`);
      return { success: true };
    }
    return { success: false, error: 'Email was rejected by the SMTP server.' };
  } catch (err) {
    console.warn(`⚠️ SMTP send failed: ${err.message}`);
    return { success: false, error: `SMTP error: ${err.message}` };
  }
}

// =============================================================================
// ROUTES
// =============================================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'JH Innovation Connect Backend API',
    uptimeSeconds: Math.floor(process.uptime()),
    smtpConfigured: hasSmtp,
    supabaseConfigured: Boolean(supabase),
    timestamp: new Date().toISOString()
  });
});

// ---------------------------------------------------------------------------
// SEND OTP
// ---------------------------------------------------------------------------
app.post('/api/send-otp', otpLimiter, async (req, res) => {
  const { email, password, meta } = req.body;
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!cleanEmail || !/\S+@\S+\.\S+/.test(cleanEmail)) {
    return res.status(400).json({ success: false, error: 'Valid email address is required.' });
  }

  if (!hasSmtp) {
    return res.status(503).json({ success: false, error: 'Email delivery is not configured on this server.' });
  }

  try {
    // Generate secure 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Preserve existing registration data on resend
    const existing = otpStore.get(cleanEmail);

    otpStore.set(cleanEmail, {
      otp: hashedOtp,
      password: password || existing?.password,
      meta: meta || existing?.meta,
      expiresAt,
      attempts: 0,
    });

    // Actually send the email
    const deliveryResult = await sendOtpEmail(cleanEmail, otp);

    if (!deliveryResult.success) {
      // Delete the OTP since it can't be delivered
      otpStore.delete(cleanEmail);
      return res.status(502).json({
        success: false,
        error: deliveryResult.error || 'Failed to send OTP email. Please check server email configuration and try again.',
      });
    }

    return res.json({
      success: true,
      message: 'OTP sent to your email.',
    });
  } catch (error) {
    console.error('Error in /api/send-otp:', error.message);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// ---------------------------------------------------------------------------
// VERIFY OTP
// ---------------------------------------------------------------------------
app.post('/api/verify-otp', verifyLimiter, async (req, res) => {
  const { email, otp } = req.body;
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!cleanEmail || !otp) {
    return res.status(400).json({ success: false, error: 'Email and 6-digit OTP are required.' });
  }

  const record = otpStore.get(cleanEmail);
  if (!record) {
    return res.status(400).json({ success: false, error: 'No active OTP found. Please request a new code.' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(cleanEmail);
    return res.status(400).json({ success: false, error: 'OTP has expired. Please request a new code.' });
  }

  record.attempts = (record.attempts || 0) + 1;
  if (record.attempts > 5) {
    otpStore.delete(cleanEmail);
    return res.status(400).json({ success: false, error: 'Too many invalid attempts. Please request a new OTP.' });
  }

  const hashedInput = crypto.createHash('sha256').update(otp.toString().trim()).digest('hex');
  if (hashedInput !== record.otp) {
    return res.status(400).json({ success: false, error: 'Invalid OTP. Please check the 6-digit code and try again.' });
  }

  // OTP valid — consume it
  const password = record.password;
  const meta = record.meta || {};
  otpStore.delete(cleanEmail);

  // ---------------------------------------------------------------------------
  // Create user in Supabase
  // ---------------------------------------------------------------------------
  if (!supabase) {
    return res.status(503).json({ success: false, error: 'Database is not configured. Cannot create account.' });
  }

  try {
    // Use signUp with email_confirm disabled by passing emailRedirectTo: undefined
    // This creates the user without triggering Supabase's own email confirmation flow
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password || 'Citizen@12345!',
      options: {
        data: meta,
      }
    });

    if (signUpError) {
      // Handle duplicate user
      if (signUpError.message?.includes('already registered') || signUpError.status === 422) {
        return res.json({
          success: true,
          message: 'Account already exists. Please log in with your credentials.',
          userId: null,
          existingUser: true,
        });
      }
      console.error('Supabase signUp error:', signUpError.message);
      return res.status(500).json({ success: false, error: `Account creation failed: ${signUpError.message}` });
    }

    if (!signUpData?.user?.id) {
      return res.status(500).json({ success: false, error: 'Account creation returned no user. Please try again.' });
    }

    const userId = signUpData.user.id;
    console.log(`✓ User created in Supabase: ${cleanEmail} → ${userId}`);

    return res.json({
      success: true,
      message: 'OTP verified and account created successfully.',
      userId,
    });

  } catch (dbErr) {
    console.error('Supabase exception:', dbErr.message);
    return res.status(500).json({ success: false, error: 'Database error during account creation.' });
  }
});

// SPA catch-all
if (fs.existsSync(distPath)) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// =============================================================================
// START SERVER
// =============================================================================
const DEFAULT_PORT = parseInt(process.env.PORT || '3001', 10);

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`✓ Express Backend Server listening on http://localhost:${port}`);
    console.log(`✓ Health check: http://localhost:${port}/api/health`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`✗ Port ${port} is already in use. Please free up the port to start the backend.`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
};

startServer(DEFAULT_PORT);
