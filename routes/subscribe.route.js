const express=require('express');
const subscribedRouter= express.Router();
const subcriptioncontroller= require('../controller/subscriptionController');
const authenticate = require('../middleware/Auth');

subscribedRouter.post('/subscribe/:topicId',authenticate,subcriptioncontroller.subscribed)
subscribedRouter.get('/getTotalSubscription',authenticate,subcriptioncontroller.getTotalSubscription)
subscribedRouter.delete('/unsubscribe/:topicId',authenticate,subcriptioncontroller.unsubscribe);
subscribedRouter.get('/getUserSubscriptions',authenticate,subcriptioncontroller.getUserSubscriptions);

module.exports=subscribedRouter;