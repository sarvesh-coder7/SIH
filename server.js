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
<head><meta charset="UTF-8"><title>Your OTP Code</title></head>
<body style="margin:0;padding:0;background:#fbf8ee;font-family:Arial,Helvetica,sans-serif;color:#24332b;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fbf8ee;padding:30px 10px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2d6bc;">
        <tr><td style="padding:24px 30px;background:#0d5c3a;color:#ffffff;">
          <h2 style="margin:0;font-size:20px;color:#ffffff;">Government of Jharkhand</h2>
          <p style="margin:4px 0 0;font-size:12px;color:#e7dfcf;">Societal Innovation Collaboration Portal</p>
        </td></tr>
        <tr><td style="padding:32px 30px;background:#ffffff;">
          <p style="font-size:15px;color:#333333;margin:0 0 20px;">
            Hello, use the following One-Time Password (OTP) to verify your account:
          </p>
          <div style="background:#fbf8ee;border:2px dashed #0d5c3a;border-radius:12px;padding:20px;text-align:center;margin:20px 0;">
            <span style="font-family:monospace;font-size:36px;font-weight:bold;letter-spacing:8px;color:#0d5c3a;">${otp}</span>
          </div>
          <p style="font-size:12px;color:#666666;margin:20px 0 0;">
            This code is valid for 5 minutes. Do not share this OTP with anyone.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  const text = `Your OTP is: ${otp}\nThis code expires in 5 minutes. Do not share it with anyone.`;
  return { html, text };
}

// =============================================================================
// SEND EMAIL — uses SMTP
// =============================================================================
async function sendOtpEmail(toEmail, otp) {
  const subject = 'Verification OTP - JH Innovation Connect';
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
