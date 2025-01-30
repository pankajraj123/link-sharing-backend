 const express=require('express');
  const userRouter= express.Router();
 const userController=require('../controller/userController');


 userRouter.post('/registeruser',userController.register);
 userRouter.post('/loginuser',userController.login);

module.exports=userRouter;