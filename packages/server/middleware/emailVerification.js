import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.mail.ru",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email, username, token) => {
  const verificationLink = `${process.env.BASE_URL}/api/verification/verify?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Подтверждение email",
    text: `Здравствуйте, ${username}! Пожалуйста, подтвердите ваш email, перейдя по ссылке: ${verificationLink}`,
    html: `<p>Здравствуйте, ${username}!</p><p>Пожалуйста, подтвердите ваш email, перейдя по <a href="${verificationLink}">этой ссылке</a>.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};
