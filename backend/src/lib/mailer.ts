import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // STARTTLS on port 587
  auth: { user: env.SMTP_USER, pass: env.SMTP_APP_PASSWORD },
  tls: { rejectUnauthorized: false },
});

export async function sendPasswordResetEmail(to: string, rawToken: string): Promise<void> {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${rawToken}`;
  await transporter.sendMail({
    from: env.SMTP_USER,
    to,
    subject: "Reset your PINERP password",
    html: `
      <p>We received a request to reset your PINERP password.</p>
      <p><a href="${resetUrl}">Click here to choose a new password</a></p>
      <p>This link expires in 30 minutes. If you didn't request this, you can ignore this email.</p>
    `,
  });
}
