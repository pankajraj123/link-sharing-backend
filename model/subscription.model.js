import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'topics'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    uuid:{
        type:String,
    },
    seriousness: {
        type: String,
        enum: ["Casual", "Serious", "Very Serious"],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const subscriptionModel = mongoose.model("subscription", subscriptionSchema);
export default  subscriptionModel;