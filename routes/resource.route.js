const express=require('express');
const resourceRouter= express.Router();
const resourceController=require('../controller/resourceController');
const authenticate = require('../middleware/Auth');

resourceRouter.post('/createResource/:topicId',authenticate,resourceController.createresource);


module.exports=resourceRouter;