import localVarRequest = require('request');
import http = require('http');
import Promise = require('bluebird');
export declare class BaseError {
    'error'?: BaseErrorError;
    static discriminator: string | undefined;
    static attributeTypeMap: Array<{
        name: string;
        baseName: string;
        type: string;
    }>;
    static getAttributeTypeMap(): {
        name: string;
        baseName: string;
        type: string;
    }[];
}
export declare class BaseErrorError {
    'code'?: string;
    'message'?: string;
    static discriminator: string | undefined;
    static attributeTypeMap: Array<{
        name: string;
        baseName: string;
        type: string;
    }>;
    static getAttributeTypeMap(): {
        name: string;
        baseName: string;
        type: string;
    }[];
}
export declare class ResourceCreated {
    'id'?: string;
    static discriminator: string | undefined;
    static attributeTypeMap: Array<{
        name: string;
        baseName: string;
        type: string;
    }>;
    static getAttributeTypeMap(): {
        name: string;
        baseName: string;
        type: string;
    }[];
}
export declare class Template {
    'id'?: string;
    'name'?: string;
    'instances'?: Array<TemplateInstance>;
    'owner'?: string;
    'isPublished'?: boolean;
    'createdAt'?: string;
    'updatedAt'?: string;
    'tags'?: Array<string>;
    static discriminator: string | undefined;
    static attributeTypeMap: Array<{
        name: string;
        baseName: string;
        type: string;
    }>;
    static getAttributeTypeMap(): {
        name: string;
        baseName: string;
        type: string;
    }[];
}
export declare class TemplateInstance {
    'json'?: string;
    'version'?: string;
    static discriminator: string | undefined;
    static attributeTypeMap: Array<{
        name: string;
        baseName: string;
        type: string;
    }>;
    static getAttributeTypeMap(): {
        name: string;
        baseName: string;
        type: string;
    }[];
}
export declare class TemplateJSON {
    'template'?: string;
    'isPublished'?: boolean;
    'name'?: string;
    static discriminator: string | undefined;
    static attributeTypeMap: Array<{
        name: string;
        baseName: string;
        type: string;
    }>;
    static getAttributeTypeMap(): {
        name: string;
        baseName: string;
        type: string;
    }[];
}
export declare class TemplateList {
    'templates'?: Array<Template>;
    static discriminator: string | undefined;
    static attributeTypeMap: Array<{
        name: string;
        baseName: string;
        type: string;
    }>;
    static getAttributeTypeMap(): {
        name: string;
        baseName: string;
        type: string;
    }[];
}
export declare class User {
    'id'?: string;
    'authId'?: string;
    'issuer'?: string;
    'team'?: Array<string>;
    'org'?: Array<string>;
    static discriminator: string | undefined;
    static attributeTypeMap: Array<{
        name: string;
        baseName: string;
        type: string;
    }>;
    static getAttributeTypeMap(): {
        name: string;
        baseName: string;
        type: string;
    }[];
}
export declare class UserList {
    'user'?: Array<User>;
    static discriminator: string | undefined;
    static attributeTypeMap: Array<{
        name: string;
        baseName: string;
        type: string;
    }>;
    static getAttributeTypeMap(): {
        name: string;
        baseName: string;
        type: string;
    }[];
}
export interface Authentication {
    applyToRequest(requestOptions: localVarRequest.Options): void;
}
export declare class HttpBasicAuth implements Authentication {
    username: string;
    password: string;
    applyToRequest(requestOptions: localVarRequest.Options): void;
}
export declare class ApiKeyAuth implements Authentication {
    private location;
    private paramName;
    apiKey: string;
    constructor(location: string, paramName: string);
    applyToRequest(requestOptions: localVarRequest.Options): void;
}
export declare class OAuth implements Authentication {
    accessToken: string;
    applyToRequest(requestOptions: localVarRequest.Options): void;
}
export declare class VoidAuth implements Authentication {
    username: string;
    password: string;
    applyToRequest(_: localVarRequest.Options): void;
}
export declare enum TemplateApiApiKeys {
    bearer_auth = 0
}
export declare class TemplateApi {
    protected _basePath: string;
    protected defaultHeaders: any;
    protected _useQuerystring: boolean;
    protected authentications: {
        'default': Authentication;
        'bearer_auth': ApiKeyAuth;
    };
    constructor(basePath?: string);
    useQuerystring: boolean;
    basePath: string;
    setDefaultAuthentication(auth: Authentication): void;
    setApiKey(key: TemplateApiApiKeys, value: string): void;
    templateById(templateId: string, options?: any): Promise<{
        response: http.IncomingMessage;
        body: TemplateList;
    }>;
    templateGet(isPublished?: boolean, name?: string, version?: string, owned?: boolean, options?: any): Promise<{
        response: http.IncomingMessage;
        body: TemplateList;
    }>;
    templatePost(body: TemplateJSON, options?: any): Promise<{
        response: http.IncomingMessage;
        body: ResourceCreated;
    }>;
    templateTemplateIdPost(templateId: string, body: TemplateJSON, options?: any): Promise<{
        response: http.IncomingMessage;
        body?: any;
    }>;
}
export declare enum UserApiApiKeys {
    bearer_auth = 0
}
export declare class UserApi {
    protected _basePath: string;
    protected defaultHeaders: any;
    protected _useQuerystring: boolean;
    protected authentications: {
        'default': Authentication;
        'bearer_auth': ApiKeyAuth;
    };
    constructor(basePath?: string);
    useQuerystring: boolean;
    basePath: string;
    setDefaultAuthentication(auth: Authentication): void;
    setApiKey(key: UserApiApiKeys, value: string): void;
    userDelete(options?: any): Promise<{
        response: http.IncomingMessage;
        body?: any;
    }>;
    userGet(options?: any): Promise<{
        response: http.IncomingMessage;
        body: UserList;
    }>;
}
