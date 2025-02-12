import express from 'express'
import {subscribed,getTotalSubscription,getUserSubscriptions,unsubscribe} from'../controller/subscription.controller.js'
import {authenticate} from '../middleware/Auth.js'
const subscribedRouter= express.Router();

subscribedRouter.post('/subscribe/:topicId',authenticate,subscribed)
subscribedRouter.get('/get-total-subscription',authenticate,getTotalSubscription)
subscribedRouter.delete('/unsubscribe/:topicId',authenticate,unsubscribe);
subscribedRouter.get('/get-user-subscriptions',authenticate,getUserSubscriptions);

export default subscribedRouter;
