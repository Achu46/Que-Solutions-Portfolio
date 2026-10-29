const nodemailer = require('nodemailer');
const db = require('../db');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return transporter;
}

async function sendEmail({ to, subject, html, text, leadId = null }) {
  const mailer = getTransporter();
  let status = 'SENT';
  let errorMessage = null;

  try {
    if (mailer) {
      await mailer.sendMail({
        from: `"QUE SOLUTIONS" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html,
      });
      console.log(`[Email Service] Sent email to: ${to} (Subject: "${subject}")`);
    } else {
      console.log(`[Email Mock] SMTP credentials not set. Simulated email to: ${to}`);
      console.log(`[Email Mock] Subject: ${subject}`);
      console.log(`[Email Mock] Body:\n${text || html}`);
    }
  } catch (error) {
    console.error(`[Email Service Error]`, error.message);
    status = 'FAILED';
    errorMessage = error.message;
  }

  // Audit log into database
  try {
    await db.query(
      `INSERT INTO email_logs (lead_id, recipient_email, subject, body, status, error_message, sent_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`,
      [leadId, to, subject, text || html, status, errorMessage]
    );
  } catch (dbErr) {
    console.error('[Email Log DB Error]', dbErr.message);
  }

  return { success: status === 'SENT', error: errorMessage };
}

async function sendLeadNotification({ leadCode, name, company, email, phone, service, requirement, message }) {
  const adminRecipient = process.env.ADMIN_NOTIFICATION_EMAIL || 'que.solutions.services@gmail.com';
  const subject = `[New Quote Request] ${leadCode} - ${company} (${service})`;
  
  const textBody = `
New Lead Received on QUE SOLUTIONS Website:
---------------------------------------------
Lead ID: ${leadCode}
Name: ${name}
Company: ${company}
Email: ${email}
Phone: ${phone}
Service: ${service}
Monthly Requirement: ${requirement || 'Not specified'}
Message: ${message || 'No additional message'}
---------------------------------------------
Access Admin Dashboard: ${process.env.CLIENT_URL || 'http://localhost:5173'}/que
`;

  const htmlBody = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
  <div style="background-color: #1E2917; padding: 16px; border-radius: 6px; text-align: center;">
    <h2 style="color: #6C8C54; margin: 0;">QUE SOLUTIONS</h2>
    <p style="color: #C4D4BB; margin: 4px 0 0 0; font-size: 14px;">New Quote / Lead Notification</p>
  </div>

  <div style="padding: 20px 0;">
    <p style="font-size: 16px; color: #334155;">You have received a new business quotation request:</p>
    <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px; font-weight: bold; color: #475569; width: 35%;">Lead Code:</td>
        <td style="padding: 10px; color: #0f172a; font-weight: bold;">${leadCode}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px; font-weight: bold; color: #475569;">Contact Name:</td>
        <td style="padding: 10px; color: #0f172a;">${name}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px; font-weight: bold; color: #475569;">Company Name:</td>
        <td style="padding: 10px; color: #0f172a;">${company}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px; font-weight: bold; color: #475569;">Email:</td>
        <td style="padding: 10px; color: #0f172a;"><a href="mailto:${email}">${email}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px; font-weight: bold; color: #475569;">Phone:</td>
        <td style="padding: 10px; color: #0f172a;"><a href="tel:${phone}">${phone}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px; font-weight: bold; color: #475569;">Service:</td>
        <td style="padding: 10px; color: #54703F; font-weight: 600;">${service}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px; font-weight: bold; color: #475569;">Monthly Need:</td>
        <td style="padding: 10px; color: #0f172a;">${requirement || 'Standard onboarding plan'}</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold; color: #475569; vertical-align: top;">Message:</td>
        <td style="padding: 10px; color: #334155;">${message || 'No additional message provided'}</td>
      </tr>
    </table>
  </div>

  <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e2e8f0;">
    <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/que" style="background-color: #54703F; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
      Open Admin Dashboard
    </a>
  </div>
</div>
`;

  return sendEmail({
    to: adminRecipient,
    subject,
    text: textBody,
    html: htmlBody,
  });
}

module.exports = {
  sendEmail,
  sendLeadNotification,
};
