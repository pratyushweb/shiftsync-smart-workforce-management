import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"ShiftSync" <noreply@shiftsync.com>`,
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Message sent: ${info.messageId}`);
    return { success: true, info };
  } catch (error) {
    // Log the error but do NOT re-throw — SMTP issues are non-fatal
    console.error(`[Email] Failed to send to ${to}: ${error.message}`);
    return { success: false, error: error.message };
  }
};
