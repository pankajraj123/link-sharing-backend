const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    uuid:{
        type:String,
        required:true
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
    photo: {
        type: String
    },
    admin: {
        type: Boolean
    },
    activate: {
        type: Boolean
    },
    datecreated: {
        type: Date
    },
    lastupdate: {
        type: Date
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date,
    },
});

module.exports = mongoose.model("users", UserSchema);