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
export declare class PostedTemplate {
    'name'?: string;
    'version'?: string;
    'template'?: any;
    'state'?: PostedTemplate.StateEnum;
    'isShareable'?: boolean;
    'isPublished'?: boolean;
    'tags'?: Array<string>;
    'data'?: Array<string>;
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
export declare namespace PostedTemplate {
    enum StateEnum {
        Draft,
        Live,
        Deprecated
    }
}
export declare class PostedUser {
    'firstName'?: string;
    'lastName'?: string;
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
export declare class Recent {
    'recentlyViewed'?: TemplateList;
    'recentlyEdited'?: TemplateList;
    'recentlyUsed'?: TagList;
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
export declare class TagList {
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
export declare class Template {
    'id'?: string;
    'name'?: string;
    'instances'?: Array<TemplateInstance>;
    'owner'?: string;
    'isLive'?: boolean;
    'createdAt'?: string;
    'updatedAt'?: string;
    'tags'?: Array<string>;
    'deletedVersions'?: Array<string>;
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
export declare class TemplateInfo {
    'id'?: string;
    'name'?: string;
    'instance'?: TemplatePreviewInstance;
    'tags'?: Array<string>;
    'owner'?: TemplatePreviewUser;
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
    'id'?: string;
    'json'?: string;
    'version'?: string;
    'publishedAt'?: string;
    'state'?: TemplateInstance.StateEnum;
    'isShareable'?: boolean;
    'numHits'?: number;
    'data'?: Array<string>;
    'updatedAt'?: string;
    'createdAt'?: string;
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
export declare namespace TemplateInstance {
    enum StateEnum {
        Draft,
        Live,
        Deprecated
    }
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
export declare class TemplatePreview {
    'template'?: TemplateInfo;
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
export declare class TemplatePreviewInstance {
    'version'?: string;
    'json'?: string;
    'state'?: string;
    'data'?: Array<string>;
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
export declare class TemplatePreviewUser {
    'firstName'?: string;
    'lastName'?: string;
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
export declare class User {
    'id'?: string;
    'authId'?: string;
    'authIssuer'?: string;
    'firstName'?: string;
    'lastName'?: string;
    'team'?: Array<string>;
    'org'?: Array<string>;
    'recentlyViewed'?: Array<string>;
    'recentlyEdited'?: Array<string>;
    'recentTags'?: Array<string>;
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
    set useQuerystring(value: boolean);
    set basePath(basePath: string);
    get basePath(): string;
    setDefaultAuthentication(auth: Authentication): void;
    setApiKey(key: TemplateApiApiKeys, value: string): void;
    allTemplates(isPublished?: boolean, name?: string, version?: string, owned?: boolean, sortBy?: 'alphabetical' | 'dateCreated' | 'dateUpdated', sortOrder?: 'ascending' | 'descending', tags?: string, options?: any): Promise<{
        response: http.IncomingMessage;
        body: TemplateList;
    }>;
    createTemplate(body: PostedTemplate, options?: any): Promise<{
        response: http.IncomingMessage;
        body: ResourceCreated;
    }>;
    deleteTemplateById(templateId: string, version?: string, options?: any): Promise<{
        response: http.IncomingMessage;
        body?: any;
    }>;
    getRecent(options?: any): Promise<{
        response: http.IncomingMessage;
        body: Recent;
    }>;
    postTemplateById(templateId: string, body: PostedTemplate, options?: any): Promise<{
        response: http.IncomingMessage;
        body?: any;
    }>;
    templateById(templateId: string, isPublished?: boolean, version?: string, options?: any): Promise<{
        response: http.IncomingMessage;
        body: TemplateList;
    }>;
    templatePreview(templateId: string, version: string, options?: any): Promise<{
        response: http.IncomingMessage;
        body: TemplatePreview;
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
    set useQuerystring(value: boolean);
    set basePath(basePath: string);
    get basePath(): string;
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
    userPost(body: PostedUser, options?: any): Promise<{
        response: http.IncomingMessage;
        body?: any;
    }>;
}
