/**
 * @class
 * Class representing error returned by api endpoints.
 */
export class TemplateError {
    public code : string;
    public message : string;

    public constructor(code : string, message: string) {
        this.code = code;
        this.message = message;
    }
}