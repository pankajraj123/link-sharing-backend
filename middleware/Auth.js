import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {INVALID_JWT_TOKEN,TOKEN_MISSING} from '../constant/Auth.constant.js'
dotenv.config();


export const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token){
    return res.status(403).json({ message: TOKEN_MISSING });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error){
    console.log(error);
    return res.status(400).json({ message:INVALID_JWT_TOKEN});
  }
};
