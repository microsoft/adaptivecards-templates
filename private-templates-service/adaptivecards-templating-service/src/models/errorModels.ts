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
    TemplateNotFound = "TemplateNotFound",
    InvalidAuthenticationToken = "InvalidAuthenticationToken"
}

/**
 * @enum
 * Error messages returned by TemplateServiceClient's JSONResponses
 */
export enum LibraryErrorMessage {
    AuthFailureResponse = "No owner specified, please authenticate.",
    InvalidUser = "Failed to create user."
}