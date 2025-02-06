import resource from "../model/resource.model.js";
import topics from "../model/topics.js";
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
      createdby:id,
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
    const topiclist = await topics.find({ createdby: userid });

    let topicsDetails = [];

    if (topiclist.length > 0) {
      topicsDetails = topiclist.map((topic) => ({
        _id:topic._id,
        name: topic.name,
        visibility: topic.visibility,
        dateCreated: topic.dateCreated,
      }));
    }
    return res.status(200).json({
      totalTopic: topiclist.length,
      topic: topicsDetails,
      message: "Topics fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getpublictopic = async (req, res) => {
  const userid = req.user.user._id;

  try {
    let publictopic = [];

   let  publiclist = await topics
      .find({ visibility: "public" })
      .populate("createdby");
   

    if (publiclist.length > 0) {
      publictopic = publiclist.map((topic) => ({
        _id:topic._id,
        uuid:topic.uuid,
        name: topic.name,
        username: topic.createdby.username,
        visibility: topic.visibility,
        dateCreated: topic.dateCreated,
      }));
    

      return res
        .status(200)
        .json({
          message: "Public topics fetched successfully",
          topic: publictopic,
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteTopic = async (req, res) => {
  const {topicId} = req.params
  if (!topicId) {
    return res.status(400).json({ message: "topicId is required" });
  }
  try{
    const topicdata = await topics.findOne({ uuid:topicId});
    if(!topicdata){
      return res.status(404).json({ message: "Topic not found" });
    }else {
      await topics.deleteOne({uuid: topicId });
      await resource.deleteMany({ topic:topicId});
      return res
        .status(200)
        .json({
          message: "Topic Delete Successfully And Resource Also deleted",
        });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const editTopic = async (req, res) => {
  const { name, visibility } = req.body;
  const {topicId} =req.params;
  if (!name || !visibility || !topicId) {
    return res
      .status(400)
      .json({ message: "Topic name , visibility or  topicId is required" });
  }
  try {
    
    const topicdata = await topics.findOne({uuid:topicId});

    if (!topicdata) {
      return res.status(404).json({ message: "Topic not found" });
    }

    await topics.updateOne(
      { uuid: topicId },
      { $set: { name: name, visibility: visibility } }
    );
     return res.status(200).json({message:"Topic Updated Sucessfully"})
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
