/**
 * @class
 * Class representing error returned by api endpoints.
 */
export class TemplateError {
    public code : ApiError;
    public message : string;

    public constructor(code : ApiError, message: string) {
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
