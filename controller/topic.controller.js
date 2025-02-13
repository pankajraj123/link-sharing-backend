import resource from "../model/resource.model.js";
import topics from "../model/topics.model.js";
import subscription from "../model/subscription.model.js";
import { v4 as uuidv4 } from "uuid";

export const createTopic = async (req, res) => {
  try {
    const { name, visibility } = req.body;
    const id = req.user.user._id;
    if (!name || !visibility) {
      return res.status(400).json({ message: "All Fields are Required" });
    }
    const isExist = await topics.findOne({ name });
    if (isExist) {
      return res.status(409).json({ message: "Topic Already Exists" });
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
    res
      .status(201)
      .json({ message: "Topic created successfully", topic: topicData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
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
      message: "Topics fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
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
        message: "Public topics fetched successfully",
        topic: publicTopic,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteTopic = async (req, res) => {
  const { topicId } = req.params;
  if (!topicId) {
    return res.status(400).json({ message: "topicId is required" });
  }
  try {
    const topicData = await topics.findOne({ _id: topicId });
    if (!topicData) {
      return res.status(404).json({ message: "Topic not found" });
    } else {
      await topics.deleteOne({ _id: topicId });
      await subscription.deleteMany({ topicId: topicId });
      await resource.deleteMany({ topic: topicId });
      return res.status(200).json({
        message: "Topic Delete Successfully And Resource Also deleted",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const editTopic = async (req, res) => {
  const { name, visibility } = req.body;
  const { topicId } = req.params;
  if (!name || !visibility || !topicId) {
    return res
      .status(400)
      .json({ message: "Topic name , visibility or  topicId is required" });
  }
  if (await topics.findOne({ name: name })) {
    return res
      .status(409)
      .json({ success: false, message: "Topic name Exist Try Another Name" });
  }
  try {
    const topicData = await topics.findOne({ _id: topicId });
    if (!topicData) {
      return res.status(404).json({ message: "Topic not found" });
    }
    await topics.updateOne(
      { _id: topicId },
      { $set: { name: name, visibility: visibility } }
    );
    return res.status(200).json({ message: "Topic Updated Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
