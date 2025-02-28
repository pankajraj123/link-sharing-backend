import resource from "../model/resource.model.js";
import topics from "../model/topics.model.js";
import { v4 as uuidv4 } from "uuid";
import {
  CREATE_RESOURCE_MISSING_FIELDS,
  CREATE_RESOURCE_TOPIC_NOT_FOUND,
  CREATE_RESOURCE_SUCCESS,
  CREATE_RESOURCE_FAILURE,
} from "../constant/resource.constants.js";
import {
  TOPIC_DESCRIPTION_MISSING_TOPIC,
  TOPIC_DESCRIPTION_RESOURCE_NOT_FOUND,
  TOPIC_DESCRIPTION_FETCH_SUCCESS,
  TOPIC_DESCRIPTION_FAILURE,
} from "../constant/resource.constants.js";
import mongoose from'mongoose'
export const createResource = async (req, res) => {
  try {
    const id = req.user.user._id;
    const { description,Url} = req.body;
    const { topicId } = req.params;

    if (!description || !topicId){
      return res.status(400).json({ message: CREATE_RESOURCE_MISSING_FIELDS });
    }
    const topicData = await topics.findById(topicId);
    if (!topicData){
      return res.status(404).json({ message: CREATE_RESOURCE_TOPIC_NOT_FOUND });
    }
    const resourceData = new resource({
      uuid: uuidv4(),
      Url:Url,
      description: description,
      topicId: topicId,
      createdBy:id,
      dateCreated: Date.now(),
      lastUpdated: Date.now(),
    });
    await resourceData.save();
    return res.status(200).json({
      resourceData: resourceData,
      message: CREATE_RESOURCE_SUCCESS,
    });
  } catch (error){
    return res.status(500).json({ message: CREATE_RESOURCE_FAILURE });
  }
};

export const topicDescription = async (req, res) => {
  const { topicId } = req.params;
  if (!topicId) {
    return res.status(400).json({ message: TOPIC_DESCRIPTION_MISSING_TOPIC });
  }
  try {
    const topicResources = await resource
      .find({ topicId: topicId })
      .populate({
        path: "topicId",
        populate: {
          path: "createdBy",
        },
      })
      .populate("createdBy");
    if (!topicResources){
      return res
        .status(400)
        .json({ message: TOPIC_DESCRIPTION_RESOURCE_NOT_FOUND });
    }
    let topicData =[];
    if (topicResources.length > 0) {
      topicData = topicResources.map((data) => ({
        _id:data._id,
        createdBy: data.createdBy.userName,
        topicCreatedBy: data.topicId.createdBy.userName,
        Url:data.Url,
        description: data.description,
        name: data.topicId.name,
        date: data.dateCreated, 
      }));
    }

    return res
      .status(200)
      .json({ message: TOPIC_DESCRIPTION_FETCH_SUCCESS,topicData });
  } catch (error) {
    return res.status(500).json({ message: TOPIC_DESCRIPTION_FAILURE });
  }
};
export const userTopicResource = async (req, res) => {
  try {
    const userId = req.user.user._id;
    const userResources = await resource
      .find()
      .populate({
        path: "topicId",
        populate: {
          path: "createdBy", 
        },
      })
      .populate("createdBy"); 

    if (!userResources || userResources.length === 0) {
      return res
        .status(404)
        .json({ message: "No resources or topics found for the user" });
    }
  const objectId= new mongoose.Types.ObjectId(userId);
    const userResourceData = userResources
      .filter(
        (data) =>
          objectId.equals(data.createdBy._id) ||
          objectId.equals(data.topicId.createdBy._id)
      ) 
      .map((data) => ({
        _id: data._id,
        createdBy: data.createdBy.userName,
        topicCreatedBy: data.topicId.createdBy.userName, 
        Url: data.Url,
        description: data.description,
        name: data.topicId.name, 
        date: data.dateCreated,
      }));

    return res.status(200).json({
      message: "Topic description fetched successfully",
      userResourceData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching resources" });
  }
};

