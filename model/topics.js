import mongoose from  'mongoose';

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    uuid:{
        type:String,
    },
    createdby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    dateCreated:{
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    visibility:{
        type: String,
        enum: ['public', 'private'],
    }
});

const topicModel = mongoose.model("topics", topicSchema);

export default topicModel;