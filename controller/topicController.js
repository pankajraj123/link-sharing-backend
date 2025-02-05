const topics = require('../model/topics');
const user = require('../model/users');
const resource = require("../model/resource.model");
const subscription = require('../model/subscription.model')
const { v4: uuidv4 } = require('uuid');


exports.createTopic = async (req, res) => {
  try {
    const { name, visibility, } = req.body;
    const id = req.user.user._id;
    if (!name || !visibility ) {
      return res.status(400).json({ message: "All Fields are Required" });
    }
    const isExist = await topics.findOne({ name });

    if (isExist) {
      return res.status(409).json({ message: "Topic Already Exists" });
    }

    let topicData = new topics({
      name: name,
      uuid:uuidv4(),
      visibility: visibility,
      createdby: id,
    });
    await topicData.save();

    await subscription.create({
      topicId: topicData._id,
      userId: id,
      seriousness: "Casual",
      createdAt: Date.now()
    })
    res.status(201).json({ message: "Topic created successfully", topic: topicData });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getUserTopics = async (req, res) => {
  const userid = req.user.user._id;
  try {
    const topiclist = await topics.find({ createdby: userid });

    let topicsDetails = [];

    if (topiclist.length > 0) {
      topicsDetails = topiclist.map((topic) => ({
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

exports.getpublictopic = async (req, res) => {
  const userid = req.user.user._id;

  try {
    publiclist = await topics.find({ visibility: "public" }).populate("createdby");

    let publictopic = [];

    if (publiclist.length > 0) {
      publictopic = publiclist.map((topic) => ({
        _id:topic._id,
        name: topic.name,
        username: topic.createdby.username,
        visibility: topic.visibility,
        dateCreated: topic.dateCreated,
      }));

      return res.status(200).json({ message: "Public topics fetched successfully", topic: publictopic });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
}

exports.deleteTopic = async (req, res) => {
  const { name } = req.body;
  if(!name){
    return res.status(400).json({ message: "Topic name is required" });
  }
  try {
    const topicdata = await topics.findOne({ name });
    if (!topicdata) {
      return res.status(404).json({ message: 'Topic not found' })
    } 
    else {
      await topics.deleteOne({ name: name });
      await resource.deleteMany({ topic: topicdata._id });
      return res.status(200).json({ message: "Topic Delete Successfully And Resource Also deleted" });
    }
  }catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }

}


exports.editTopic = async (req,res)=>{
  const {name,visibility} = req.body;
  const {id} = req.params;
  if(!name || !visibility || !id){
    return res.status(400).json({ message: "Topic name , visibility or  id is required" });
  }
  try {
   const topicdata = await topics.findOne({ _id: id});
   if(!topicdata){
    return res.status(404).json({message: 'Topic not found'})
   }
   await topics.updateOne({ _id: id }, { $set: { name: name, visibility:visibility}})
  }catch(error){
    return res.status(500).json({message: 'Internal Server Error', error});
  }
}
