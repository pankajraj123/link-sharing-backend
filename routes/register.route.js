import express from "express";
import {
  register,
  login,
  forgetPassword,
  resetPassword,
  changePassword,
} from "../controller/user.controller.js";
import { authenticate } from "../middleware/Auth.js";

const userRouter = express.Router();

userRouter.post("/registeruser", register);
userRouter.post("/loginuser", login);
userRouter.post("/forgotpassword", forgetPassword);
userRouter.post("/resetpassword/:token", resetPassword);
userRouter.post("/changePassword", authenticate, changePassword);

export default userRouter;
