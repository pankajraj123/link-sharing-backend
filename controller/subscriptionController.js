import topics from '../model/topics.js'
import subscription from '../model/subscription.model.js'
import {v4 as uuidv4} from 'uuid'


export const subscribed = async (req, res) => {
  const { seriousness } = req.body;
  const { topicId } = req.params;
  const userid = req.user.user._id;

  if (!seriousness || !topicId) {
    return res.status(400).json({ message: 'Please provide seriousness and topicId' });
  }

  try {
    const issubscribed = await subscription.findOne({ topicId: topicId, userId: userid })
    if (issubscribed) {
      return res.status(409).json({ message: 'user already subscribed' });
    }

    const topicExist = await topics.findOne({_id: topicId, visibility: 'public' });
    if (!topicExist) {
      return res.status(404).json({ message: "Topic not found " });
    }
    await subscription.create({
      uuid:uuidv4(),
      topicId: topicId,
      userId: userid,
      seriousness: seriousness,
      createdAt: Date.now()
    })
    return res.status(200).json({ message: "subscribed successfully", seriousness: seriousness });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "internal server", error })
  }
}

export const unsubscribe = async (req, res) => {
  const { topicId } = req.params;
  const userid = req.user.user.uuid;
  if (!topicId) {
    return res.status(400).json({ message: 'Please provide topicId' });
  }

  try {
    const subscriptiondata = await subscription.findOne({ topicId: topicId, userId: userid });
    if (!subscriptiondata) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    await subscription.deleteOne({ topicId: topicId, userId: userid });
    return res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

export const getUserSubscriptions = async (req, res) => {
  try {
    const userId = req.user.user.uuid;
    const userSubscriptions = await subscription.find({ userId: userId }).populate('topicId');
    return res.status(200).json({ message: "User subscription detail fetched sucessfully", userSubscriptions });
  } catch (error) {
    return res.status(500).json({ message: 'server error', error })
  }
}   


export const getTotalSubscription = async (req, res) => {
  const _id = req.user.user.uuid
  try {
    const data = await subscription.find().populate('topicId');
     
    const subscribedlength = data.length;
    return res.status(200).json({ message: 'total subscrition fetched', count: subscribedlength })
  } catch (error) {
    return res.status(500).json({ message: "interval server", error })
  }
}
