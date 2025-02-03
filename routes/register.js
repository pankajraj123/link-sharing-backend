 const express=require('express');
  const userRouter= express.Router();
 const userController=require('../controller/userController');
 const authenticate = require('../middleware/Auth');

 userRouter.post('/registeruser',userController.register);
 userRouter.post('/loginuser',userController.login);
 userRouter.post('/forgotpassword',userController.forgetPassword);
 userRouter.post('/resetpassword/:token',userController.resetPassword);
 userRouter.post('/changePassword',authenticate,userController.changePassword);

module.exports=userRouter;