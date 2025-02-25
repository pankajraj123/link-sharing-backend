// Constants for Create Topic Controller
export const CREATE_TOPIC_MISSING_FIELDS = "All Fields are Required";
export const CREATE_TOPIC_ALREADY_EXISTS = "Topic Already Exists";
export const CREATE_TOPIC_SUCCESS = "Topic created successfully";
export const CREATE_TOPIC_FAILURE = "Internal Server Error";

// Constants for Get User Topics Controller
export const GET_USER_TOPICS_SUCCESS = "Topics fetched successfully";
export const GET_USER_TOPICS_FAILURE = "Server error";

// Constants for Get Public Topic Controller
export const GET_PUBLIC_TOPIC_SUCCESS = "Public topics fetched successfully";
export const GET_PUBLIC_TOPIC_FAILURE = "Server error";

// Constants for Delete Topic Controller
export const DELETE_TOPIC_TOPIC_ID_REQUIRED = "topicId is required";
export const DELETE_TOPIC_NOT_FOUND = "Topic not found";
export const DELETE_TOPIC_SUCCESS ="Topic Delete Successfully And Resource Also deleted";
export const DELETE_TOPIC_FAILURE = "Internal Server Error";

// Constants for Edit Topic Controller
export const EDIT_TOPIC_MISSING_FIELDS =
  "Topic name, visibility or topicId is required";
export const EDIT_TOPIC_NAME_EXISTS = "Topic name Exist Try Another Name";
export const EDIT_TOPIC_SUCCESS = "Topic Updated Successfully";
export const EDIT_TOPIC_FAILURE = "Internal Server Error";
