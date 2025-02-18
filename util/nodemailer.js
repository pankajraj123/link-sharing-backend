import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

 export const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: process.env.MY_GMAIL,
    pass: process.env.MY_GMAIL_PASSWORD,
  },
});