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

userRouter.post("/register-user", register);
userRouter.post("/login-user", login);
userRouter.post("/forgot-password", forgetPassword);
userRouter.post("/reset-password/:token", resetPassword);
userRouter.post("/change-password", authenticate, changePassword);

export default userRouter;
