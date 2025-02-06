import express from 'express'
import {createresource,topicDescription} from '../controller/resourceController.js'
import { authenticate } from '../middleware/Auth.js';

const resourceRouter= express.Router();

resourceRouter.post('/createResource/:topicId',authenticate,createresource);
resourceRouter.get('/getDiscription/:topicId',authenticate,topicDescription);

export default resourceRouter;