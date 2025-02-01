 const express=require('express');
  const topicRouter= express.Router();
 const topicController=require('../controller/topicController');
 const authenticate=require('../middleware/Auth')

 topicRouter.post('/topiccreate',authenticate,topicController.createTopic);
//  topicRouter.get('/gettopic/:id',topicController.getTopic);

module.exports=topicRouter;