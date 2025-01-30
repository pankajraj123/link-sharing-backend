const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
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
        enum: ['public', 'private'], 
        default: 'public' 
    }
});

module.exports = mongoose.model("Topics", TopicSchema);
