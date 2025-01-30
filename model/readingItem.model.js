const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
    resource:{
      type: mongoose.Schema.Types.ObjectId,
      ref:'resource'
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    isRead:{
        type:Boolean
    }
});

const readingModel = mongoose.model("readingItem", readingSchema);
 module.exports=readingModel;