import {
  CREATE_TOPIC_MISSING_FIELDS,
  CREATE_TOPIC_ALREADY_EXISTS,
  CREATE_TOPIC_SUCCESS,
  CREATE_TOPIC_FAILURE,
  GET_USER_TOPICS_SUCCESS,
  GET_USER_TOPICS_FAILURE,
  GET_PUBLIC_TOPIC_SUCCESS,
  GET_PUBLIC_TOPIC_FAILURE,
  DELETE_TOPIC_TOPIC_ID_REQUIRED,
  DELETE_TOPIC_NOT_FOUND,
  DELETE_TOPIC_SUCCESS,
  DELETE_TOPIC_FAILURE,
  EDIT_TOPIC_MISSING_FIELDS,
  EDIT_TOPIC_NAME_EXISTS,
  EDIT_TOPIC_SUCCESS,
  EDIT_TOPIC_FAILURE,
} from "../constant/topic.constant.js";

import resource from "../model/resource.model.js";
import topics from "../model/topics.model.js";
import subscription from "../model/subscription.model.js";
import { v4 as uuidv4 } from "uuid";

export const createTopic = async (req, res) => {
  try {
    const { name, visibility } = req.body;
    const id = req.user.user._id;
    if (!name || !visibility) {
      return res.status(400).json({ message: CREATE_TOPIC_MISSING_FIELDS });
    }
    const isExist = await topics.findOne({ name });
    if (isExist) {
      return res.status(409).json({ message: CREATE_TOPIC_ALREADY_EXISTS });
    }
    let topicData = new topics({
      name: name,
      uuid: uuidv4(),
      visibility: visibility,
      createdBy: id,
    });
    await topicData.save();
    await subscription.create({
      uuid: uuidv4(),
      topicId: topicData._id,
      userId: id,
      seriousness: "Serious",
      createdAt: Date.now(),
    });
    res.status(201).json({ message: CREATE_TOPIC_SUCCESS, topic: topicData });
  } catch (error) {
    res
      .status(500)
      .json({ message: CREATE_TOPIC_FAILURE, error: error.message });
  }
};

export const getUserTopics = async (req, res) => {
  const userid = req.user.user._id;
  try {
    const topicList = await topics.find({ createdBy: userid });
    let topicsDetails = [];
    if (topicList.length > 0) {
      topicsDetails = topicList.map((topic) => ({
        _id: topic._id,
        name: topic.name,
        visibility: topic.visibility,
        dateCreated: topic.dateCreated,
      }));
    }
    return res.status(200).json({
      totalTopic: topicList.length,
      topic: topicsDetails,
      message: GET_USER_TOPICS_SUCCESS,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: GET_USER_TOPICS_FAILURE, error });
  }
};

export const getPublicTopic = async (req, res) => {
  const userid = req.user.user._id;
  try {
    const publicList = await topics
      .find({ visibility: "public" })
      .populate("createdBy");
    if (publicList.length > 0) {
      const publicTopic = publicList.map((topic) => ({
        _id: topic._id,
        uuid: topic.uuid,
        name: topic.name,
        userName: topic.createdBy.userName,
        visibility: topic.visibility,
        dateCreated: topic.dateCreated,
      }));
      return res.status(200).json({
        message: GET_PUBLIC_TOPIC_SUCCESS,
        topic: publicTopic,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: GET_PUBLIC_TOPIC_FAILURE, error });
  }
};

export const deleteTopic = async (req, res) => {
  const { topicId } = req.params;
  if (!topicId) {
    return res.status(400).json({ message: DELETE_TOPIC_TOPIC_ID_REQUIRED });
  }
  try {
    const topicData = await topics.findOne({ _id: topicId });
    if (!topicData) {
      return res.status(404).json({ message: DELETE_TOPIC_NOT_FOUND });
    } else {
      await topics.deleteOne({ _id: topicId });
      await subscription.deleteMany({ topicId: topicId });
      await resource.deleteMany({ topic: topicId });
      return res.status(200).json({
        message: DELETE_TOPIC_SUCCESS,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: DELETE_TOPIC_FAILURE, error: error.message });
  }
};

export const editTopic = async (req, res) => {
  const { name, visibility } = req.body;
  const { topicId } = req.params;
  if (!name || !visibility || !topicId) {
    return res.status(400).json({ message: EDIT_TOPIC_MISSING_FIELDS });
  }
  if (await topics.findOne({ name: name })) {
    return res
      .status(409)
      .json({ success: false, message: EDIT_TOPIC_NAME_EXISTS });
  }
  try {
    const topicData = await topics.findOne({ _id: topicId });
    if (!topicData) {
      return res.status(404).json({ message: DELETE_TOPIC_NOT_FOUND });
    }
    await topics.updateOne(
      { _id: topicId },
      { $set: { name: name, visibility: visibility } }
    );
    return res.status(200).json({ message: EDIT_TOPIC_SUCCESS });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: EDIT_TOPIC_FAILURE, error });
  }
};
