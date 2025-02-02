 const express=require('express');
  const topicRouter= express.Router();
 const topicController=require('../controller/topicController');
 const authenticate=require('../middleware/Auth')

topicRouter.post('/topiccreate',authenticate,topicController.createTopic);
topicRouter.get('/getUserTopic',authenticate,topicController.getUserTopics);

module.exports=topicRouter;