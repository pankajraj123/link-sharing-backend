 const express=require('express');
  const topicRouter= express.Router();
 const topicController=require('../controller/topicController');

 topicRouter.post('/topiccreate',topicController.createTopic);
//  topicRouter.get('/gettopic/:id',topicController.getTopic);

module.exports=topicRouter;