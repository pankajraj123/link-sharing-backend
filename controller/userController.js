import Users from "../model/users.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

export const register = async (req, res) => {
  let { email, username, password, firstname, lastname } = req.body;

  if (!username || !email || !password || !firstname || !lastname) {
    res.send("all fields are required");
  }

  const valid = await Users.findOne({
    $or: [{ email }, { username }],
  });

  if (valid) {
    res.send("user is alerady exist");
    return;
  }

  const hashpassword = await bcrypt.hash(password, 10);
  password = hashpassword;
  const data = new Users({
    uuid: uuidv4(),
    email,
    username,
    password,
    firstname,
    lastname,
  });
  await data.save();
  res.send("user craeted sucessfully");
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "user is not exist" });
    }

    const loged = await bcrypt.compare(password, user.password);
    const token = jwt.sign({ user }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    if (loged) {
      res.send({
        username: user.username,
        token: token,
        message: "user login sucessfully",
      });
    } else {
      res.send("login failed");
    }
  } catch (error) {
    res.send(error);
  }
};

export const changePassword = async (req, res) => {
  try {
    const id = req.user.user._id;

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userdetail = await Users.findOne({ _id: id });

    if (!userdetail) {
      return res.status(404).json({ message: "user is not exist" });
    }

    const checkPassword = await bcrypt.compare(
      oldPassword,
      userdetail.password
    );

    if (checkPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await Users.findOneAndUpdate(
        { _id: id },
        { $set: { password: hashedPassword } }
      );
      return res.status(201).json({ message: "password changed sucessfully" });
    } else {
      return res.status(401).json({ message: "Old Password is incorrect" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await Users.findOne({ email: email });

  if (!user) {
    return res.status(404).send("User not found");
  }

  const token = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  await user.save();
  const resetUrl = `http://localhost:3000/resetPassword/${token}`;
  const mailOptions = {
    to: email,
    from: process.env.MY_GMAIL,
    subject: "Password Reset Request",
    text: `Please click the link to reset your password: ${resetUrl}`,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.MY_GMAIL,
      pass: process.env.MY_GMAIL_PASSWORD,
    },
  });


  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error sending email");
    }
    res.status(200).send("Password reset email sent");
  });
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required" });
  }

  const user = await Users.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .send("Password reset token is invalid or has expired");
  }
  const hashpassword = await bcrypt.hash(newPassword, 10);
  user.password = hashpassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.status(200).send("Your password has been reset successfully");
};
