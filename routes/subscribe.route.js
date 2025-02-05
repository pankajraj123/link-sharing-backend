import express from 'express'
import {subscribed,getTotalSubscription,getUserSubscriptions,unsubscribe} from'../controller/subscriptionController.js'
import {authenticate} from '../middleware/Auth.js'
const subscribedRouter= express.Router();

subscribedRouter.post('/subscribe/:topicId',authenticate,subscribed)
subscribedRouter.get('/getTotalSubscription',authenticate,getTotalSubscription)
subscribedRouter.delete('/unsubscribe/:topicId',authenticate,unsubscribe);
subscribedRouter.get('/getUserSubscriptions',authenticate,getUserSubscriptions);

export default subscribedRouter;