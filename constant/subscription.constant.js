// Constants for Subscribe Action
export const SUBSCRIBE_MISSING_FIELDS ="Please provide seriousness and topicId";
export const SUBSCRIBE_ALREADY_EXISTS = "User already subscribed";
export const SUBSCRIBE_TOPIC_NOT_FOUND = "Topic not found";
export const SUBSCRIBE_SUCCESS = "Subscribed successfully";
export const SUBSCRIBE_FAILURE = "Internal server error";

// Constants for Unsubscribe Action
export const UNSUBSCRIBE_MISSING_TOPIC = "Please provide topicId";
export const UNSUBSCRIBE_NOT_FOUND = "Subscription not found";
export const UNSUBSCRIBE_SUCCESS = "Unsubscribed successfully";
export const UNSUBSCRIBE_FAILURE = "Internal server error";

// Constants for Get User Subscriptions Action
export const GET_USER_SUBSCRIPTIONS_SUCCESS ="User subscription detail fetched successfully";
export const GET_USER_SUBSCRIPTIONS_FAILURE ="Server error";

// Constants for Get Total Subscription Action
export const GET_TOTAL_SUBSCRIPTION_SUCCESS = "Total Subscription fetched";
export const GET_TOTAL_SUBSCRIPTION_FAILURE = "Internal server error";
