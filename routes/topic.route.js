 const express=require('express');
  const topicRouter= express.Router();
 const topicController=require('../controller/topicController');
 const authenticate=require('../middleware/Auth')

topicRouter.post('/topiccreate',authenticate,topicController.createTopic);
topicRouter.get('/getUserTopic',authenticate,topicController.getUserTopics);
topicRouter.delete('/deleteTopic',authenticate,topicController.deleteTopic);
topicRouter.get('/getPublicTopic',authenticate,topicController.getpublictopic);


module.exports=topicRouter;