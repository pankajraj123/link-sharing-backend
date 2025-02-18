import express from "express";
import {
  createResource,
  topicDescription,
} from "../controller/resource.controller.js";
import { authenticate } from "../middleware/Auth.js";

const resourceRouter = express.Router();

resourceRouter.post("/create-resource/:topicId", authenticate, createResource);
resourceRouter.get("/get-description/:topicId", authenticate, topicDescription);

export default resourceRouter;
