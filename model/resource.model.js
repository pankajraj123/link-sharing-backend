const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    createdby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'topics'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

const resourceModel = mongoose.model("resource", resourceSchema);
module.exports = resourceModel;