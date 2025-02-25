// constants for Register 
export const REGISTER_MISSING_FIELDS = "all fields are required"
export const REGISTER_INVALID_CREDENTIAL=''
export const REGISTER_CONFLICT = "user is already exist"
export const REGISTER_SUCCESS = "user created successfully"
export const REGISTER_FAILURE = "user is not register"

// constant for Login
export const LOGIN_MISSING_FIELDS = "All fields are required";
export const LOGIN_INVALID_CREDENTIAL = "Enter correct Password";
export const LOGIN_USER_NOT_EXIST = "user is not exist"
export const LOGIN_SUCCESS = "user login successfully"
export const LOGIN_FAILURE = "Internal server error";


// Constants for Change Password
export const CHANGE_PASSWORD_MISSING_FIELDS = "Old password and new password are required";
export const CHANGE_PASSWORD_INCORRECT_OLD = "Old password is incorrect";
export const CHANGE_PASSWORD_SUCCESS = "Password changed successfully";
export const CHANGE_PASSWORD_FAILURE = "Internal server error";
export const CHANGE_PASSWORD_USER_NOT_EXIST = "user is not exist"

// Constants for Forget Password
export const FORGET_PASSWORD_EMAIL_REQUIRED = "Email is required";
export const FORGET_PASSWORD_USER_NOT_FOUND = "User not found";
export const FORGET_PASSWORD_EMAIL_SENT = "Password reset email sent";
export const FORGET_PASSWORD_FAILURE = "Error sending email";

// Constants for Reset Password
export const RESET_PASSWORD_TOKEN_REQUIRED = "Token and new password are required";
export const RESET_PASSWORD_INVALID_TOKEN = "Password reset token is invalid or has expired";
export const RESET_PASSWORD_SUCCESS = "Your password has been reset successfully";
