const subscription = require('../model/subscription.model')
const topics = require('../model/topics')

exports.subscribed = async (req, res) => {
  const { seriousness } = req.body;
  const { topicId } = req.params;
  console.log(req.params)
  const userid = req.user.user._id;
  console.log('hello  i am in subscribed ')
  try {
   const issubscribed=await subscription.findOne({topicId:topicId,userId:userid})
   if(issubscribed){
    return res.status(409).json({message:'user already subscribed'});
  }

    const topicExist = await topics.findOne({ _id: topicId, visibility: 'public' });
    if (!topicExist) {
      return res.status(404).json({ message: "Topic not found " });
    }
    await subscription.create({
      topicId: topicId,
      userId: userid,
      seriousness: seriousness,
      createdAt: Date.now()
    })
    return res.status(200).json({ message: "subscribed successfully",seriousness: seriousness});
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "internal server", error })
  }
}

exports.unsubscribe = async (req, res) => {
  const { topicId } = req.params;
  console.log(topicId)
  const userid = req.user.user._id;
  console.log("hii i am in unsubscribed ")

  try {
    const subscriptiondata = await subscription.findOne({ topicId: topicId, userId: userid });
    if (!subscriptiondata) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    await subscription.deleteOne({ topicId: topicId, userId: userid });
    return res.status(200).json({ message:'Unsubscribed successfully'});
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.getUserSubscriptions=async(req,res)=>{
try{
  const userId=req.user.user._id;
  const userSubscriptions= await  subscription.find({userId:userId}).populate('topicId');
  return res.status(200).json({ message:"User subscription detail fetched sucessfully",userSubscriptions});
}catch(error){
  return res.status(500).json({message:'server error',error})
}
}

exports.getTotalSubscription = async (req, res) => {
  const _id = req.user.user._id
  try {
    const data = await subscription.find({ userId: _id });
    const subscribedlength = data.length;
    return res.status(200).json({ message: 'total subscrition fetched', count: subscribedlength })
  } catch (error) {
    return res.status(500).json({ message: "interval server", error })
  }
}
