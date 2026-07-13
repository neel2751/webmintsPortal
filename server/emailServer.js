"use server";
import nodemailer from "nodemailer";

export async function sendEmail({ from, to, subject, text, html }) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: from || process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}

export async function sendWelcomeEmail({ guideTitle, email, accessKey }) {
  const subject = `Your Free Guide: ${guideTitle}`;
  const text = `Thank you for subscribing! Here is your custom guide based on "${guideTitle}". Use the access key: ${accessKey} to download your guide.`;
  const html = `
        <h1>Here is your custom guide!</h1>
        <p>Thank you for subscribing. You can access your private guide below:</p>
        <a href="https://webmints.in/guide/${accessKey}" style="background: black; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          View My Private Guide
        </a>
      `;

  return await sendEmail({ to: email, subject, text, html });
}
