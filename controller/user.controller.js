import Users from "../model/users.model.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
dotenv.config();
import {transporter,getMailOptions} from '../util/nodemailer.js'
import {REGISTER_FAILURE,REGISTER_MISSING_FIELDS,REGISTER_SUCCESS,REGISTER_CONFLICT} from '../constant/user.constant.js'
import { LOGIN_FAILURE,LOGIN_INVALID_CREDENTIAL,LOGIN_SUCCESS,LOGIN_USER_NOT_EXIST, } from "../constant/user.constant.js";
import {
  CHANGE_PASSWORD_MISSING_FIELDS,
  CHANGE_PASSWORD_INCORRECT_OLD,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE,
  CHANGE_PASSWORD_USER_NOT_EXIST
} from "../constant/user.constant.js";
import {
  FORGET_PASSWORD_EMAIL_REQUIRED,
  FORGET_PASSWORD_USER_NOT_FOUND,
  FORGET_PASSWORD_EMAIL_SENT,
  FORGET_PASSWORD_FAILURE,
} from "../constant/user.constant.js";
import { RESET_PASSWORD_TOKEN_REQUIRED ,RESET_PASSWORD_INVALID_TOKEN,RESET_PASSWORD_SUCCESS} from "../constant/user.constant.js";



export const register = async (req, res) => {
  let { email, userName, password, firstName, lastName } = req.body;
  if (!userName || !email || !password || !firstName || !lastName) {
    res.status(404).json({ success:false,message:REGISTER_MISSING_FIELDS});
  }
 try{
 const valid = await Users.findOne({
   $or: [{ email }, { userName }],
 });
 if (valid) {
    return res.status(409).json({ success: false, message: REGISTER_CONFLICT});
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
 res.status(200).json({ success: true, message:REGISTER_SUCCESS});
 }catch(error){
  res.status(500).json({ success: false, message: REGISTER_FAILURE});
 }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message:REGISTER_MISSING_FIELDS});
    }
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message:LOGIN_USER_NOT_EXIST});
    }
    const isLogIn = await bcrypt.compare(password, user.password);
    const token = jwt.sign({ user }, process.env.SECRET_KEY, {
      expiresIn: "10d",
    });
    if(isLogIn){
      res.status(200).json({ success:true,
        userId:user._id,
        userName: user.userName,
        token: token,
        message:LOGIN_SUCCESS,
      });
    } else {
      res.status(401).json({success:false,message:LOGIN_INVALID_CREDENTIAL})
    }
  } catch (error) {
    res.status(500).json({message:LOGIN_FAILURE})
  }
};

export const changePassword = async (req, res) => {
  try {
    const id = req.user.user.uuid;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || newPassword) {
      return res.status(400).json({ message: CHANGE_PASSWORD_MISSING_FIELDS});
    }
    const userDetail = await Users.findOne({ uuid: id });
    if (!userDetail) {
      return res.status(404).json({ message: CHANGE_PASSWORD_USER_NOT_EXIST});
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
      return res.status(201).json({ message: CHANGE_PASSWORD_SUCCESS });
    } else {
      return res.status(401).json({ message: CHANGE_PASSWORD_INCORRECT_OLD });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: CHANGE_PASSWORD_FAILURE });
  }
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: FORGET_PASSWORD_EMAIL_REQUIRED });
  }
  const user = await Users.findOne({ email: email });
  if (!user) {
    return res.status(404).send(FORGET_PASSWORD_USER_NOT_FOUND);
  }
  const token = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  await user.save();
  const resetUrl = `${process.env.PASSWORD_RESET_APP_URL}/${token}`;
  const mailOptions =getMailOptions(resetUrl,email);
  transporter.sendMail(mailOptions,(err, response)=>{
    if (err){
      return res.status(500).send(FORGET_PASSWORD_FAILURE);
    }else{
      console.log("hello i am in send ")
  return res.status(200).send(FORGET_PASSWORD_EMAIL_SENT);
    }
  });
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ message: RESET_PASSWORD_TOKEN_REQUIRED });
  }
  const user = await Users.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).send(RESET_PASSWORD_INVALID_TOKEN);
  }
  const hashPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.status(200).send(RESET_PASSWORD_SUCCESS);
};

export const  getUserDetail=async(req,res)=>{
  try {
    const userId = req.user.user._id;
    const user = await Users.findById(userId).select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) {
      return res.status(404).json({ success: false, message: LOGIN_USER_NOT_EXIST });
    }
   return  res.status(200).json({ success: true, user });
  } catch (error) {
   return  res.status(500).json({ success: false, message: LOGIN_FAILURE });
  }
}

export const editProfile = async (req, res) => {
  try {
    const userId = req.user.user._id;
    const { firstName, lastName, userName } = req.body;

    if (!firstName || !lastName || !userName) {
      return res.status(400).json({ success: false, message: REGISTER_MISSING_FIELDS });
    }

    const existingUser = await Users.findOne({ userName, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: REGISTER_CONFLICT });
    }

    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      { firstName, lastName, userName },
      { new: true }
    ).select('-password -resetPasswordToken -resetPasswordExpires');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: LOGIN_USER_NOT_EXIST });
    }

    const token = jwt.sign({ user: { _id: userId, userName } }, process.env.SECRET_KEY, {
      expiresIn: "10d",
    });

    res.status(200).json({
      success: true,
      user: updatedUser,
      token: token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: REGISTER_FAILURE });
  }
};
