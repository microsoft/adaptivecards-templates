/**
 * @class
 * Class representing error returned by api endpoints.
 */
export class TemplateError {
  public code: ApiError;
  public message: string;

  public constructor(code: ApiError, message: string) {
    this.code = code;
    this.message = message;
  }
}

/**
 * @enum
 * Errors types returned by TemplateServiceClient's express router.
 */
export enum ApiError {
  InvalidTemplate = "InvalidTemplate",
  InvalidQueryParam = "InvalidQueryParam",
  TemplateNotFound = "TemplateNotFound",
  InvalidAuthenticationToken = "InvalidAuthenticationToken",
  UserNotFound = "UserNotFound",
  DeleteUserInfoFailed = "Failed to delete all user info."
}

/**
 * @enum
 * Error messages returned by TemplateServiceClient's JSONResponses
 */
export enum ServiceErrorMessage {
  AuthFailureResponse = "No owner specified, please authenticate.",
  InvalidUser = "Failed to create user.",
  InvalidTemplate = "Invalid template.",
  DeleteUserInfoFailed = "Failed to delete all user info."
}
