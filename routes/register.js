 const express=require('express');
  const userRouter= express.Router();
 const userController=require('../controller/userController');


 userRouter.post('/registeruser',userController.register);
 userRouter.post('/loginuser',userController.login);
 userRouter.post('/forgotpassword',userController.forgetPassword);
 userRouter.post('/resetpassword/:token',userController.resetPassword);

module.exports=userRouter;