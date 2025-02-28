import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
  },
  Url:{
     type: String,
  },
  uuid: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "topics",
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const resourceModel = mongoose.model("resource", resourceSchema);

export default resourceModel;
