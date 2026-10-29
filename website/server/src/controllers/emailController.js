const db = require('../db');
const { sendEmail } = require('../services/mailService');

async function handleSendEmail(req, res) {
  try {
    const { to, subject, message, leadId } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Recipient email, subject, and message body are required.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid recipient email address.'
      });
    }

    const formattedHtml = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
  <div style="border-bottom: 2px solid #54703F; padding-bottom: 12px; margin-bottom: 16px;">
    <h2 style="color: #1E2917; margin: 0;">QUE SOLUTIONS</h2>
    <p style="color: #54703F; margin: 4px 0 0 0; font-size: 13px; font-weight: bold;">PEOPLE • PROCESS • PROGRESS</p>
  </div>
  <div style="color: #334155; line-height: 1.6; white-space: pre-line; font-size: 15px;">
    ${message}
  </div>
  <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8;">
    <p style="margin: 0;"><strong>Que Solutions</strong> · Erode, Tamil Nadu</p>
    <p style="margin: 4px 0 0 0;">Phone: 7092490337 · Email: que.solutions.services@gmail.com</p>
  </div>
</div>
`;

    const result = await sendEmail({
      to: to.trim(),
      subject: subject.trim(),
      text: message.trim(),
      html: formattedHtml,
      leadId: leadId ? parseInt(leadId, 10) : null,
    });

    return res.json({
      success: true,
      message: result.success ? 'Email dispatched successfully.' : 'Email processed (logged in system history).',
      details: result
    });
  } catch (error) {
    console.error('[Email Controller Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function getEmailLogs(req, res) {
  try {
    const { limit = 50 } = req.query;
    const result = await db.query(
      `SELECT * FROM email_logs ORDER BY sent_at DESC LIMIT $1`,
      [parseInt(limit, 10)]
    );
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  handleSendEmail,
  getEmailLogs,
};
