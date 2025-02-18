import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true,
  },
  uuid:{
    type: String,
  },
  userName:{
    type: String,
    required: true,
  },
  password:{
    type: String,
    required: true,
  },
  firstName:{
    type: String,
    required: true,
  },
  lastName:{
    type: String,
    required: true,
  },
  photo:{
    type: String,
  },
  admin: {
    type: Boolean,
  },
  activate: {
    type: Boolean,
  },
  dateCreate: {
    type: Date,
  },
  lastUpdate: {
    type: Date,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

const userSchema = mongoose.model("users", UserSchema);

export default userSchema;
