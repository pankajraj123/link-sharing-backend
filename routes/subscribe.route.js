const express=require('express');
const subscribedRouter= express.Router();
const subcriptioncontroller= require('../controller/subscriptionController');
const authenticate = require('../middleware/Auth');

subscribedRouter.post('/subscribe/:id',authenticate,subcriptioncontroller.subscribed)
subscribedRouter.get('/getTotalSubscription',authenticate,subcriptioncontroller.getTotalSubscription)

module.exports=subscribedRouter;