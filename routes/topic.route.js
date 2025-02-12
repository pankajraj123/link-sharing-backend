import express from "express";
import {
  createTopic,
  getUserTopics,
  getPublicTopic,
  deleteTopic,
  editTopic,
} from "../controller/topic.controller.js";
import { authenticate } from "../middleware/Auth.js";
const topicRouter = express.Router();

topicRouter.post("/topic-create", authenticate, createTopic);
topicRouter.get("/get-user-topic", authenticate, getUserTopics);
topicRouter.delete("/delete-topic/:topicId", authenticate, deleteTopic);
topicRouter.put("/edit-topic/:topicId", authenticate, editTopic);
topicRouter.get("/get-public-topic", authenticate, getPublicTopic);

export default topicRouter;
