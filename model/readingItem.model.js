import mongoose from  'mongoose';

const readingSchema = new mongoose.Schema({
    resource: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'resource'
    },
    uuid:{
        type:String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    isRead: {
        type: Boolean
    }
});

const readingModel = mongoose.model("readingItem", readingSchema);


export default readingModel