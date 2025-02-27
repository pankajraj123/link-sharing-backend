import express from "express";
import {
  createResource,
  topicDescription,
  userTopicResource,
} from "../controller/resource.controller.js";
import { authenticate } from "../middleware/Auth.js";

const resourceRouter = express.Router();

resourceRouter.post("/create-resource/:topicId", authenticate, createResource);
resourceRouter.get("/get-description/:topicId", authenticate, topicDescription);
resourceRouter.get("/get-user-topic-resource" ,authenticate,userTopicResource);

export default resourceRouter;
