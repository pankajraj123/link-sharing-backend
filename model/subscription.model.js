const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    topic:{
      type: mongoose.Schema.Types.ObjectId,
      ref:'topics'
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    isRead:{
        type:Boolean
    }
});

const subscriptionModel = mongoose.model("subscription", subscriptionSchema);
module.exports=subscriptionModel;