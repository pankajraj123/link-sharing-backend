import express from 'express'
import {createresource} from '../controller/resourceController.js'
import { authenticate } from '../middleware/Auth.js';

const resourceRouter= express.Router();

resourceRouter.post('/createResource/:topicId',authenticate,createresource);

export default resourceRouter;