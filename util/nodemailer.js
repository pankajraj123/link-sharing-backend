import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const getMailOptions = (resetUrl, email) => {
  return {
    to: email,
    from: process.env.MY_GMAIL,
    subject: "Password Reset Request",
    html: `
      <div>
        Please click the link to reset your password:
        <a href="${resetUrl}">Reset Password</a>
      </div>
    `,
  };
};

 export const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: process.env.MY_GMAIL,
    pass: process.env.MY_GMAIL_PASSWORD,
  },
});