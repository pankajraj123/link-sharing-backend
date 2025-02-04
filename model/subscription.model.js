const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'topics'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    seriousness: {
        type: String,
        enum: ["Casual", "Serious", "very Serious"],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const subscriptionModel = mongoose.model("subscription", subscriptionSchema);
module.exports = subscriptionModel;