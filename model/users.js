import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    uuid:{
        type:String,
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    photo:{
        type: String
    },
    admin:{
        type: Boolean
    },
    activate:{
        type: Boolean
    },
    datecreated:{
        type: Date
    },
    lastupdate:{
        type: Date
    },
    resetPasswordToken:{
        type: String
    },
    resetPasswordExpires:{
        type: Date,
    },
});

const userSchema = mongoose.model("users", UserSchema);

export default  userSchema;