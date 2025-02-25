import {
  SUBSCRIBE_MISSING_FIELDS,
  SUBSCRIBE_ALREADY_EXISTS,
  SUBSCRIBE_TOPIC_NOT_FOUND,
  SUBSCRIBE_SUCCESS,
  SUBSCRIBE_FAILURE,
  UNSUBSCRIBE_MISSING_TOPIC,
  UNSUBSCRIBE_NOT_FOUND,
  UNSUBSCRIBE_SUCCESS,
  UNSUBSCRIBE_FAILURE,
  GET_USER_SUBSCRIPTIONS_SUCCESS,
  GET_USER_SUBSCRIPTIONS_FAILURE,
  GET_TOTAL_SUBSCRIPTION_SUCCESS,
  GET_TOTAL_SUBSCRIPTION_FAILURE,
} from "../constant/subscription.constant.js";

import topics from "../model/topics.model.js";
import subscription from "../model/subscription.model.js";
import { v4 as uuidv4 } from "uuid";

export const subscribed = async (req, res) => {
  const { seriousness } = req.body;
  const { topicId } = req.params;
  const userId = req.user.user._id;
  if (!seriousness || !topicId) {
    return res.status(400).json({ message: SUBSCRIBE_MISSING_FIELDS });
  }
  try {
    const isSubscribed = await subscription.findOne({
      topicId: topicId,
      userId: userId,
    });
    if (isSubscribed) {
      return res.status(409).json({ message: SUBSCRIBE_ALREADY_EXISTS });
    }
    const topicExist = await topics.findOne({
      _id: topicId,
      visibility: "public",
    });
    if (!topicExist) {
      return res.status(404).json({ message: SUBSCRIBE_TOPIC_NOT_FOUND });
    }
    await subscription.create({
      uuid: uuidv4(),
      topicId: topicId,
      userId: userId,
      seriousness: seriousness,
      createdAt: Date.now(),
    });
    return res
      .status(200)
      .json({ message: SUBSCRIBE_SUCCESS, seriousness: seriousness });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: SUBSCRIBE_FAILURE, error });
  }
};

export const unsubscribe = async (req, res) => {
  const { topicId } = req.params;
  const userId = req.user.user._id;
  if (!topicId) {
    return res.status(400).json({ message: UNSUBSCRIBE_MISSING_TOPIC });
  }
  try {
    const subscriptionData = await subscription.findOne({
      topicId: topicId,
      userId: userId,
    });
    if (!subscriptionData) {
      return res.status(404).json({ message: UNSUBSCRIBE_NOT_FOUND });
    }
    await subscription.deleteOne({ topicId: topicId, userId: userId });
    return res.status(200).json({ message: UNSUBSCRIBE_SUCCESS });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: UNSUBSCRIBE_FAILURE, error });
  }
};

export const getUserSubscriptions = async (req, res) => {
  try {
    const userId = req.user.user._id;
    const userSubscriptions = await subscription
      .find({ userId: userId })
      .populate({
        path: "topicId",
        populate: {
          path: "createdBy",
        },
      });
    return res.status(200).json({
      message: GET_USER_SUBSCRIPTIONS_SUCCESS,
      userSubscriptions,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: GET_USER_SUBSCRIPTIONS_FAILURE, error });
  }
};

export const getTotalSubscription = async (req, res) => {
  const id = req.user.user._id;
  try {
    const data = await subscription.find({ userId: id }).populate("topicId");
    const subscribeLength = data.length;
    return res
      .status(200)
      .json({
        message: GET_TOTAL_SUBSCRIPTION_SUCCESS,
        count: subscribeLength,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: GET_TOTAL_SUBSCRIPTION_FAILURE, error });
  }
};
