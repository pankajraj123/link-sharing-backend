const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now 
    },
    visibility: {
        type: String,
        enum:['public', 'private'],
    }
});

const topicModel = mongoose.model("topics", topicSchema);
 module.exports=topicModel;