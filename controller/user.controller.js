import Users from "../model/users.model.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
dotenv.config();
import {transporter} from '../util/nodemailer.js'

export const register = async (req, res) => {
  let { email, userName, password, firstName, lastName } = req.body;
  if (!userName || !email || !password || !firstName || !lastName) {
    res.status(404).json({ success:false,message:"all fields are required"});
  }
 try{
 const valid = await Users.findOne({
   $or: [{ email }, { userName }],
 });
 if (valid) {
   res.status(409).json({ success:false,message:"user is already exist"});
   return;
 }

 const hashPassword = await bcrypt.hash(password, 10);
 password = hashPassword;
 const data = new Users({
   uuid: uuidv4(),
   email,
   userName,
   password,
   firstName,
   lastName,
 });
 await data.save();
 res.status(200).json({ success: true, message: "user created successfully" });
 }catch(error){
  res.status(500).json({success:false,message:"user is not register"})
 }
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
    const isLogIn = await bcrypt.compare(password, user.password);
    const token = jwt.sign({ user }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    if(isLogIn){
      res.status(200).json({ success:true,
        userId:user._id,
        userName: user.userName,
        token: token,
        message: "user login successfully",
      });
    } else {
      res.status(401).json({success:false,message:"Enter correct Password"})
    }
  } catch (error) {
    res.status(500).json({message:"Internal server error"})
  }
};

export const changePassword = async (req, res) => {
  try {
    const id = req.user.user.uuid;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userDetail = await Users.findOne({ uuid: id });
    if (!userDetail) {
      return res.status(404).json({ message: "user is not exist" });
    }
    const checkPassword = await bcrypt.compare(
      oldPassword,
      userDetail.password
    );
    if (checkPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await Users.findOneAndUpdate(
        { uuid: id },
        { $set: { password: hashedPassword } }
      );
      return res.status(201).json({ message: "password changed successfully" });
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
  const resetUrl = `${process.env.PASSWORD_RESET_APP_URL}/${token}`;
  const mailOptions = {
    to: email,
    from: process.env.MY_GMAIL,
    subject: "Password Reset Request",
    text: `Please click the link to reset your password: ${resetUrl}`,
  };
  transporter.sendMail(mailOptions, (err, response) => {
    if (err){
      return res.status(500).send("Error sending email");
    }else{
      console.log("hello i am");
  return res.status(200).send("Password reset email sent");
    }
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
  const hashPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.status(200).send("Your password has been reset successfully");
};
