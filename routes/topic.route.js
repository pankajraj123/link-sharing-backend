import express from "express";
import {
  createTopic,
  getUserTopics,
  getpublictopic,
  deleteTopic,
  editTopic,
} from "../controller/topic.controller.js";
import { authenticate } from "../middleware/Auth.js";
const topicRouter = express.Router();

topicRouter.post("/topiccreate", authenticate, createTopic);
topicRouter.get("/getUserTopic", authenticate, getUserTopics);
topicRouter.delete("/deleteTopic/:topicId", authenticate, deleteTopic);
topicRouter.put("/editTopic/:topicId", authenticate, editTopic);
topicRouter.get("/getPublicTopic", authenticate, getpublictopic);

export default topicRouter;
