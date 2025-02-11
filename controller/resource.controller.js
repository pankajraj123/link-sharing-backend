import resource from "../model/resource.model.js";
import topics from "../model/topics.model.js";
import { v4 as uuidv4 } from "uuid";

export const createresource = async (req, res) => {
  try {
    const id = req.user.user._id;
    const { description } = req.body;
    const { topicId } = req.params;
    if (!description || !topicId) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    console.log(topicId);
    const topicdata = await topics.findById(topicId);
    if (!topicdata) {
      return res.status(404).json({ message: "Topic not found" });
    }
    const resourcedata = new resource({
      uuid: uuidv4(),
      description: description,
      topicId:topicId,
      createdby: id,
      dateCreated: Date.now(),
      lastUpdated: Date.now(),
    });

    await resourcedata.save();
    return res
      .status(200)
      .json({
        resourceData: resourcedata,
        message: "resource created successfully",
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const topicDescription = async (req, res) => {
  const { topicId } = req.params;
  if (!topicId) {
    return res.status(400).json({ message: "Topic ID is required" });
  }
  try {
    const topicResources = await resource
      .find({ topicId: topicId })
      .populate("topicId")
      .populate("createdby");
    if (!topicResources) {
      return res.status(400).json({ message: "resource is not find" });
    }
    let topicData = [];

    if (topicResources.length > 0) {
      topicData = topicResources.map((data) => ({
        createdby: data.createdby.username, // Extracting the username of the creator
        description: data.description,
        name: data.topicId.name,
        date: data.dateCreated, // Extracting the description
      }));
    }
    
    return res.status(200).json({ topicData });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
