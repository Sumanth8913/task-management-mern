const nodemailer = require('nodemailer');

const isEmailConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);

let transporter = null;
const getTransporter = () => {
  if (!isEmailConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return transporter;
};

// Fire-and-forget style: callers should never let email failures fail the
// primary operation (task creation/completion). Errors are logged, not thrown.
const sendMail = async ({ to, subject, html }) => {
  const t = getTransporter();
  if (!t) {
    console.warn(`[emailService] SMTP not configured, skipping email "${subject}" to ${to}`);
    return { sent: false };
  }
  try {
    await t.sendMail({
      from: process.env.EMAIL_FROM || 'Task Manager <no-reply@taskmanager.dev>',
      to,
      subject,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error(`[emailService] Failed to send "${subject}" to ${to}:`, err.message);
    return { sent: false, error: err.message };
  }
};

const sendTaskCreatedEmail = (toEmail, task) =>
  sendMail({
    to: toEmail,
    subject: `Task created: ${task.title}`,
    html: `
      <h2>Task created</h2>
      <p><strong>Title:</strong> ${task.title}</p>
      <p><strong>Status:</strong> ${task.status}</p>
      <p><strong>Priority:</strong> ${task.priority}</p>
      <p><strong>Due date:</strong> ${task.dueDate ? new Date(task.dueDate).toDateString() : 'Not set'}</p>
      <p><strong>Location:</strong> ${task.location || 'Not set'}</p>
    `,
  });

const sendTaskCompletedEmail = (toEmail, task) =>
  sendMail({
    to: toEmail,
    subject: `Task completed: ${task.title}`,
    html: `
      <h2>Task completed 🎉</h2>
      <p><strong>Title:</strong> ${task.title}</p>
      <p><strong>Completed at:</strong> ${new Date(task.completedAt).toLocaleString()}</p>
    `,
  });

module.exports = { sendTaskCreatedEmail, sendTaskCompletedEmail, isEmailConfigured };
