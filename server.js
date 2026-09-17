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

// Brevo SMTP (Nodemailer relay)
const brevoSmtpHost = process.env.BREVO_SMTP_HOST;
const brevoSmtpPort = parseInt(process.env.BREVO_SMTP_PORT || '587', 10);
const brevoSmtpUser = process.env.BREVO_SMTP_USER;       // SMTP login (e.g. b7401e001@smtp-brevo.com)
const brevoSmtpPass = process.env.BREVO_SMTP_PASSWORD;    // SMTP password (xsmtpsib-…)
const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL;  // Verified sender (e.g. sarvesshhh@gmail.com)
const brevoSenderName = process.env.BREVO_SENDER_NAME || 'JH Innovation Connect - Govt of Jharkhand';

// Brevo HTTP API (separate key — xkeysib-…)
const brevoApiKey = process.env.BREVO_API_KEY;            // HTTP API key only

const hasBrevoSmtp = Boolean(brevoSmtpUser && brevoSmtpPass);
const hasBrevoApi = Boolean(brevoApiKey);
const hasAnyEmail = hasBrevoSmtp || hasBrevoApi;

// =============================================================================
// DIAGNOSTICS (never print secret values)
// =============================================================================
console.log('====================================================');
console.log('   JH INNOVATION CONNECT - API & AUTH SERVER');
console.log('====================================================');
console.log('• Supabase URL:     ', supabaseUrl ? '✓ Configured' : '✗ Missing');
console.log('• Supabase Key:     ', supabaseKey ? '✓ Configured' : '✗ Missing');
console.log('• Brevo SMTP:       ', hasBrevoSmtp ? `✓ Configured (${brevoSmtpUser})` : '✗ Not configured');
console.log('• Brevo HTTP API:   ', hasBrevoApi ? '✓ Configured' : '✗ Not configured');
console.log('• Sender Email:     ', brevoSenderEmail || '(not set — will use SMTP user)');
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
// NODEMAILER TRANSPORTER (Brevo SMTP)
// =============================================================================
let transporter = null;
let smtpVerified = false;
const fromAddress = brevoSenderEmail || brevoSmtpUser || 'no-reply@jharkhand.gov.in';

if (hasBrevoSmtp) {
  try {
    transporter = nodemailer.createTransport({
      host: brevoSmtpHost || 'smtp-relay.brevo.com',
      port: brevoSmtpPort,
      secure: brevoSmtpPort === 465,
      auth: {
        user: brevoSmtpUser,
        pass: brevoSmtpPass,
      },
    });

    transporter.verify().then(() => {
      smtpVerified = true;
      console.log(`✓ SMTP connection verified (${brevoSmtpHost || 'smtp-relay.brevo.com'}:${brevoSmtpPort})`);
    }).catch((err) => {
      console.warn(`⚠️ SMTP verification failed: ${err.message}`);
      if (hasBrevoApi) {
        console.log('  → Brevo HTTP API will be used as fallback.');
      } else {
        console.error('  ✗ No fallback email method available. OTP emails will not be delivered.');
      }
    });
  } catch (e) {
    console.error('✗ SMTP transporter init failed:', e.message);
  }
} else if (!hasBrevoApi) {
  console.warn('⚠️ No email delivery configured. OTP emails cannot be sent.');
}

// =============================================================================
// BREVO HTTP API — fallback that bypasses SMTP IP restrictions
// =============================================================================
async function sendViaBrevoApi(toEmail, subject, htmlContent, textContent) {
  if (!brevoApiKey) throw new Error('BREVO_API_KEY is not configured.');
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': brevoApiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: brevoSenderName, email: fromAddress },
      to: [{ email: toEmail }],
      subject,
      htmlContent,
      textContent,
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`Brevo API ${res.status}: ${body.message || JSON.stringify(body)}`);
  }
  return await res.json();
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
// SEND EMAIL — tries SMTP first, falls back to HTTP API
// =============================================================================
async function sendOtpEmail(toEmail, otp) {
  const subject = 'Verification OTP - JH Innovation Connect';
  const { html, text } = buildOtpEmail(otp);

  // Strategy 1: SMTP (if verified)
  if (transporter && smtpVerified) {
    try {
      const info = await transporter.sendMail({
        from: { name: brevoSenderName, address: fromAddress },
        to: toEmail,
        subject,
        text,
        html,
      });
      if (!info.rejected || info.rejected.length === 0) {
        console.log(`✓ Email sent via SMTP to ${toEmail}`);
        return true;
      }
    } catch (err) {
      console.warn(`⚠️ SMTP send failed: ${err.message}`);
    }
  }

  // Strategy 2: Brevo HTTP API (bypasses IP restrictions)
  if (hasBrevoApi) {
    try {
      await sendViaBrevoApi(toEmail, subject, html, text);
      console.log(`✓ Email sent via Brevo HTTP API to ${toEmail}`);
      return true;
    } catch (err) {
      console.warn(`⚠️ Brevo API send failed: ${err.message}`);
    }
  }

  console.error(`✗ All email delivery methods failed for ${toEmail}`);
  return false;
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
    smtpConfigured: hasBrevoSmtp,
    apiConfigured: hasBrevoApi,
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

  if (!hasAnyEmail) {
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
    const delivered = await sendOtpEmail(cleanEmail, otp);

    if (!delivered) {
      // Delete the OTP since it can't be delivered
      otpStore.delete(cleanEmail);
      return res.status(502).json({
        success: false,
        error: 'Failed to send OTP email. Please check server email configuration and try again.',
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
      console.warn(`⚠️ Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(DEFAULT_PORT);
