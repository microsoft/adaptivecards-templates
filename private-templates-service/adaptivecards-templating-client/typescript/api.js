"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var localVarRequest = require("request");
var Promise = require("bluebird");
var defaultBasePath = 'https://adaptivecms.azurewebsites.net';
var primitives = [
    "string",
    "boolean",
    "double",
    "integer",
    "long",
    "float",
    "number",
    "any"
];
var ObjectSerializer = (function () {
    function ObjectSerializer() {
    }
    ObjectSerializer.findCorrectType = function (data, expectedType) {
        if (data == undefined) {
            return expectedType;
        }
        else if (primitives.indexOf(expectedType.toLowerCase()) !== -1) {
            return expectedType;
        }
        else if (expectedType === "Date") {
            return expectedType;
        }
        else {
            if (enumsMap[expectedType]) {
                return expectedType;
            }
            if (!typeMap[expectedType]) {
                return expectedType;
            }
            var discriminatorProperty = typeMap[expectedType].discriminator;
            if (discriminatorProperty == null) {
                return expectedType;
            }
            else {
                if (data[discriminatorProperty]) {
                    return data[discriminatorProperty];
                }
                else {
                    return expectedType;
                }
            }
        }
    };
    ObjectSerializer.serialize = function (data, type) {
        if (data == undefined) {
            return data;
        }
        else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        }
        else if (type.lastIndexOf("Array<", 0) === 0) {
            var subType = type.replace("Array<", "");
            subType = subType.substring(0, subType.length - 1);
            var transformedData = [];
            for (var index in data) {
                var date = data[index];
                transformedData.push(ObjectSerializer.serialize(date, subType));
            }
            return transformedData;
        }
        else if (type === "Date") {
            return data.toString();
        }
        else {
            if (enumsMap[type]) {
                return data;
            }
            if (!typeMap[type]) {
                return data;
            }
            var attributeTypes = typeMap[type].getAttributeTypeMap();
            var instance = {};
            for (var index in attributeTypes) {
                var attributeType = attributeTypes[index];
                instance[attributeType.baseName] = ObjectSerializer.serialize(data[attributeType.name], attributeType.type);
            }
            return instance;
        }
    };
    ObjectSerializer.deserialize = function (data, type) {
        type = ObjectSerializer.findCorrectType(data, type);
        if (data == undefined) {
            return data;
        }
        else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        }
        else if (type.lastIndexOf("Array<", 0) === 0) {
            var subType = type.replace("Array<", "");
            subType = subType.substring(0, subType.length - 1);
            var transformedData = [];
            for (var index in data) {
                var date = data[index];
                transformedData.push(ObjectSerializer.deserialize(date, subType));
            }
            return transformedData;
        }
        else if (type === "Date") {
            return new Date(data);
        }
        else {
            if (enumsMap[type]) {
                return data;
            }
            if (!typeMap[type]) {
                return data;
            }
            var instance = new typeMap[type]();
            var attributeTypes = typeMap[type].getAttributeTypeMap();
            for (var index in attributeTypes) {
                var attributeType = attributeTypes[index];
                instance[attributeType.name] = ObjectSerializer.deserialize(data[attributeType.baseName], attributeType.type);
            }
            return instance;
        }
    };
    return ObjectSerializer;
}());
var BaseError = (function () {
    function BaseError() {
    }
    BaseError.getAttributeTypeMap = function () {
        return BaseError.attributeTypeMap;
    };
    BaseError.discriminator = undefined;
    BaseError.attributeTypeMap = [
        {
            "name": "error",
            "baseName": "error",
            "type": "BaseErrorError"
        }
    ];
    return BaseError;
}());
exports.BaseError = BaseError;
var BaseErrorError = (function () {
    function BaseErrorError() {
    }
    BaseErrorError.getAttributeTypeMap = function () {
        return BaseErrorError.attributeTypeMap;
    };
    BaseErrorError.discriminator = undefined;
    BaseErrorError.attributeTypeMap = [
        {
            "name": "code",
            "baseName": "code",
            "type": "string"
        },
        {
            "name": "message",
            "baseName": "message",
            "type": "string"
        }
    ];
    return BaseErrorError;
}());
exports.BaseErrorError = BaseErrorError;
var PostedTemplate = (function () {
    function PostedTemplate() {
    }
    PostedTemplate.getAttributeTypeMap = function () {
        return PostedTemplate.attributeTypeMap;
    };
    PostedTemplate.discriminator = undefined;
    PostedTemplate.attributeTypeMap = [
        {
            "name": "name",
            "baseName": "name",
            "type": "string"
        },
        {
            "name": "version",
            "baseName": "version",
            "type": "string"
        },
        {
            "name": "template",
            "baseName": "template",
            "type": "any"
        },
        {
            "name": "state",
            "baseName": "state",
            "type": "PostedTemplate.StateEnum"
        },
        {
            "name": "isShareable",
            "baseName": "isShareable",
            "type": "boolean"
        },
        {
            "name": "isPublished",
            "baseName": "isPublished",
            "type": "boolean"
        },
        {
            "name": "tags",
            "baseName": "tags",
            "type": "Array<string>"
        },
        {
            "name": "data",
            "baseName": "data",
            "type": "Array<string>"
        }
    ];
    return PostedTemplate;
}());
exports.PostedTemplate = PostedTemplate;
(function (PostedTemplate) {
    var StateEnum;
    (function (StateEnum) {
        StateEnum[StateEnum["Draft"] = 'draft'] = "Draft";
        StateEnum[StateEnum["Live"] = 'live'] = "Live";
        StateEnum[StateEnum["Deprecated"] = 'deprecated'] = "Deprecated";
    })(StateEnum = PostedTemplate.StateEnum || (PostedTemplate.StateEnum = {}));
})(PostedTemplate = exports.PostedTemplate || (exports.PostedTemplate = {}));
exports.PostedTemplate = PostedTemplate;
var PostedUser = (function () {
    function PostedUser() {
    }
    PostedUser.getAttributeTypeMap = function () {
        return PostedUser.attributeTypeMap;
    };
    PostedUser.discriminator = undefined;
    PostedUser.attributeTypeMap = [
        {
            "name": "firstName",
            "baseName": "firstName",
            "type": "string"
        },
        {
            "name": "lastName",
            "baseName": "lastName",
            "type": "string"
        },
        {
            "name": "team",
            "baseName": "team",
            "type": "Array<string>"
        },
        {
            "name": "org",
            "baseName": "org",
            "type": "Array<string>"
        }
    ];
    return PostedUser;
}());
exports.PostedUser = PostedUser;
var Recent = (function () {
    function Recent() {
    }
    Recent.getAttributeTypeMap = function () {
        return Recent.attributeTypeMap;
    };
    Recent.discriminator = undefined;
    Recent.attributeTypeMap = [
        {
            "name": "recentlyViewed",
            "baseName": "recentlyViewed",
            "type": "TemplateList"
        },
        {
            "name": "recentlyEdited",
            "baseName": "recentlyEdited",
            "type": "TemplateList"
        },
        {
            "name": "recentlyUsed",
            "baseName": "recentlyUsed",
            "type": "TagList"
        }
    ];
    return Recent;
}());
exports.Recent = Recent;
var ResourceCreated = (function () {
    function ResourceCreated() {
    }
    ResourceCreated.getAttributeTypeMap = function () {
        return ResourceCreated.attributeTypeMap;
    };
    ResourceCreated.discriminator = undefined;
    ResourceCreated.attributeTypeMap = [
        {
            "name": "id",
            "baseName": "id",
            "type": "string"
        }
    ];
    return ResourceCreated;
}());
exports.ResourceCreated = ResourceCreated;
var TagList = (function () {
    function TagList() {
    }
    TagList.getAttributeTypeMap = function () {
        return TagList.attributeTypeMap;
    };
    TagList.discriminator = undefined;
    TagList.attributeTypeMap = [
        {
            "name": "tags",
            "baseName": "tags",
            "type": "Array<string>"
        }
    ];
    return TagList;
}());
exports.TagList = TagList;
var Template = (function () {
    function Template() {
    }
    Template.getAttributeTypeMap = function () {
        return Template.attributeTypeMap;
    };
    Template.discriminator = undefined;
    Template.attributeTypeMap = [
        {
            "name": "id",
            "baseName": "_id",
            "type": "string"
        },
        {
            "name": "name",
            "baseName": "name",
            "type": "string"
        },
        {
            "name": "instances",
            "baseName": "instances",
            "type": "Array<TemplateInstance>"
        },
        {
            "name": "owner",
            "baseName": "owner",
            "type": "string"
        },
        {
            "name": "isLive",
            "baseName": "isLive",
            "type": "boolean"
        },
        {
            "name": "createdAt",
            "baseName": "createdAt",
            "type": "string"
        },
        {
            "name": "updatedAt",
            "baseName": "updatedAt",
            "type": "string"
        },
        {
            "name": "tags",
            "baseName": "tags",
            "type": "Array<string>"
        },
        {
            "name": "deletedVersions",
            "baseName": "deletedVersions",
            "type": "Array<string>"
        }
    ];
    return Template;
}());
exports.Template = Template;
var TemplateInfo = (function () {
    function TemplateInfo() {
    }
    TemplateInfo.getAttributeTypeMap = function () {
        return TemplateInfo.attributeTypeMap;
    };
    TemplateInfo.discriminator = undefined;
    TemplateInfo.attributeTypeMap = [
        {
            "name": "id",
            "baseName": "_id",
            "type": "string"
        },
        {
            "name": "name",
            "baseName": "name",
            "type": "string"
        },
        {
            "name": "instance",
            "baseName": "instance",
            "type": "TemplatePreviewInstance"
        },
        {
            "name": "tags",
            "baseName": "tags",
            "type": "Array<string>"
        },
        {
            "name": "owner",
            "baseName": "owner",
            "type": "TemplatePreviewUser"
        }
    ];
    return TemplateInfo;
}());
exports.TemplateInfo = TemplateInfo;
var TemplateInstance = (function () {
    function TemplateInstance() {
    }
    TemplateInstance.getAttributeTypeMap = function () {
        return TemplateInstance.attributeTypeMap;
    };
    TemplateInstance.discriminator = undefined;
    TemplateInstance.attributeTypeMap = [
        {
            "name": "id",
            "baseName": "_id",
            "type": "string"
        },
        {
            "name": "json",
            "baseName": "json",
            "type": "string"
        },
        {
            "name": "version",
            "baseName": "version",
            "type": "string"
        },
        {
            "name": "publishedAt",
            "baseName": "publishedAt",
            "type": "string"
        },
        {
            "name": "state",
            "baseName": "state",
            "type": "TemplateInstance.StateEnum"
        },
        {
            "name": "isShareable",
            "baseName": "isShareable",
            "type": "boolean"
        },
        {
            "name": "numHits",
            "baseName": "numHits",
            "type": "number"
        },
        {
            "name": "data",
            "baseName": "data",
            "type": "Array<string>"
        },
        {
            "name": "updatedAt",
            "baseName": "updatedAt",
            "type": "string"
        },
        {
            "name": "createdAt",
            "baseName": "createdAt",
            "type": "string"
        }
    ];
    return TemplateInstance;
}());
exports.TemplateInstance = TemplateInstance;
(function (TemplateInstance) {
    var StateEnum;
    (function (StateEnum) {
        StateEnum[StateEnum["Draft"] = 'draft'] = "Draft";
        StateEnum[StateEnum["Live"] = 'live'] = "Live";
        StateEnum[StateEnum["Deprecated"] = 'deprecated'] = "Deprecated";
    })(StateEnum = TemplateInstance.StateEnum || (TemplateInstance.StateEnum = {}));
})(TemplateInstance = exports.TemplateInstance || (exports.TemplateInstance = {}));
exports.TemplateInstance = TemplateInstance;
var TemplateList = (function () {
    function TemplateList() {
    }
    TemplateList.getAttributeTypeMap = function () {
        return TemplateList.attributeTypeMap;
    };
    TemplateList.discriminator = undefined;
    TemplateList.attributeTypeMap = [
        {
            "name": "templates",
            "baseName": "templates",
            "type": "Array<Template>"
        }
    ];
    return TemplateList;
}());
exports.TemplateList = TemplateList;
var TemplatePreview = (function () {
    function TemplatePreview() {
    }
    TemplatePreview.getAttributeTypeMap = function () {
        return TemplatePreview.attributeTypeMap;
    };
    TemplatePreview.discriminator = undefined;
    TemplatePreview.attributeTypeMap = [
        {
            "name": "template",
            "baseName": "template",
            "type": "TemplateInfo"
        }
    ];
    return TemplatePreview;
}());
exports.TemplatePreview = TemplatePreview;
var TemplatePreviewInstance = (function () {
    function TemplatePreviewInstance() {
    }
    TemplatePreviewInstance.getAttributeTypeMap = function () {
        return TemplatePreviewInstance.attributeTypeMap;
    };
    TemplatePreviewInstance.discriminator = undefined;
    TemplatePreviewInstance.attributeTypeMap = [
        {
            "name": "version",
            "baseName": "version",
            "type": "string"
        },
        {
            "name": "json",
            "baseName": "json",
            "type": "string"
        },
        {
            "name": "state",
            "baseName": "state",
            "type": "string"
        },
        {
            "name": "data",
            "baseName": "data",
            "type": "Array<string>"
        }
    ];
    return TemplatePreviewInstance;
}());
exports.TemplatePreviewInstance = TemplatePreviewInstance;
var TemplatePreviewUser = (function () {
    function TemplatePreviewUser() {
    }
    TemplatePreviewUser.getAttributeTypeMap = function () {
        return TemplatePreviewUser.attributeTypeMap;
    };
    TemplatePreviewUser.discriminator = undefined;
    TemplatePreviewUser.attributeTypeMap = [
        {
            "name": "firstName",
            "baseName": "firstName",
            "type": "string"
        },
        {
            "name": "lastName",
            "baseName": "lastName",
            "type": "string"
        },
        {
            "name": "team",
            "baseName": "team",
            "type": "Array<string>"
        },
        {
            "name": "org",
            "baseName": "org",
            "type": "Array<string>"
        }
    ];
    return TemplatePreviewUser;
}());
exports.TemplatePreviewUser = TemplatePreviewUser;
var User = (function () {
    function User() {
    }
    User.getAttributeTypeMap = function () {
        return User.attributeTypeMap;
    };
    User.discriminator = undefined;
    User.attributeTypeMap = [
        {
            "name": "id",
            "baseName": "_id",
            "type": "string"
        },
        {
            "name": "authId",
            "baseName": "authId",
            "type": "string"
        },
        {
            "name": "authIssuer",
            "baseName": "authIssuer",
            "type": "string"
        },
        {
            "name": "firstName",
            "baseName": "firstName",
            "type": "string"
        },
        {
            "name": "lastName",
            "baseName": "lastName",
            "type": "string"
        },
        {
            "name": "team",
            "baseName": "team",
            "type": "Array<string>"
        },
        {
            "name": "org",
            "baseName": "org",
            "type": "Array<string>"
        },
        {
            "name": "recentlyViewed",
            "baseName": "recentlyViewed",
            "type": "Array<string>"
        },
        {
            "name": "recentlyEdited",
            "baseName": "recentlyEdited",
            "type": "Array<string>"
        },
        {
            "name": "recentTags",
            "baseName": "recentTags",
            "type": "Array<string>"
        }
    ];
    return User;
}());
exports.User = User;
var UserList = (function () {
    function UserList() {
    }
    UserList.getAttributeTypeMap = function () {
        return UserList.attributeTypeMap;
    };
    UserList.discriminator = undefined;
    UserList.attributeTypeMap = [
        {
            "name": "user",
            "baseName": "user",
            "type": "Array<User>"
        }
    ];
    return UserList;
}());
exports.UserList = UserList;
var enumsMap = {
    "PostedTemplate.StateEnum": PostedTemplate.StateEnum,
    "TemplateInstance.StateEnum": TemplateInstance.StateEnum,
};
var typeMap = {
    "BaseError": BaseError,
    "BaseErrorError": BaseErrorError,
    "PostedTemplate": PostedTemplate,
    "PostedUser": PostedUser,
    "Recent": Recent,
    "ResourceCreated": ResourceCreated,
    "TagList": TagList,
    "Template": Template,
    "TemplateInfo": TemplateInfo,
    "TemplateInstance": TemplateInstance,
    "TemplateList": TemplateList,
    "TemplatePreview": TemplatePreview,
    "TemplatePreviewInstance": TemplatePreviewInstance,
    "TemplatePreviewUser": TemplatePreviewUser,
    "User": User,
    "UserList": UserList,
};
var HttpBasicAuth = (function () {
    function HttpBasicAuth() {
        this.username = '';
        this.password = '';
    }
    HttpBasicAuth.prototype.applyToRequest = function (requestOptions) {
        requestOptions.auth = {
            username: this.username, password: this.password
        };
    };
    return HttpBasicAuth;
}());
exports.HttpBasicAuth = HttpBasicAuth;
var ApiKeyAuth = (function () {
    function ApiKeyAuth(location, paramName) {
        this.location = location;
        this.paramName = paramName;
        this.apiKey = '';
    }
    ApiKeyAuth.prototype.applyToRequest = function (requestOptions) {
        if (this.location == "query") {
            requestOptions.qs[this.paramName] = this.apiKey;
        }
        else if (this.location == "header" && requestOptions && requestOptions.headers) {
            requestOptions.headers[this.paramName] = this.apiKey;
        }
    };
    return ApiKeyAuth;
}());
exports.ApiKeyAuth = ApiKeyAuth;
var OAuth = (function () {
    function OAuth() {
        this.accessToken = '';
    }
    OAuth.prototype.applyToRequest = function (requestOptions) {
        if (requestOptions && requestOptions.headers) {
            requestOptions.headers["Authorization"] = "Bearer " + this.accessToken;
        }
    };
    return OAuth;
}());
exports.OAuth = OAuth;
var VoidAuth = (function () {
    function VoidAuth() {
        this.username = '';
        this.password = '';
    }
    VoidAuth.prototype.applyToRequest = function (_) {
    };
    return VoidAuth;
}());
exports.VoidAuth = VoidAuth;
var TemplateApiApiKeys;
(function (TemplateApiApiKeys) {
    TemplateApiApiKeys[TemplateApiApiKeys["bearer_auth"] = 0] = "bearer_auth";
})(TemplateApiApiKeys = exports.TemplateApiApiKeys || (exports.TemplateApiApiKeys = {}));
var TemplateApi = (function () {
    function TemplateApi(basePathOrUsername, password, basePath) {
        this._basePath = defaultBasePath;
        this.defaultHeaders = {};
        this._useQuerystring = false;
        this.authentications = {
            'default': new VoidAuth(),
            'bearer_auth': new ApiKeyAuth('header', 'Authorization'),
        };
        if (password) {
            if (basePath) {
                this.basePath = basePath;
            }
        }
        else {
            if (basePathOrUsername) {
                this.basePath = basePathOrUsername;
            }
        }
    }
    Object.defineProperty(TemplateApi.prototype, "useQuerystring", {
        set: function (value) {
            this._useQuerystring = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TemplateApi.prototype, "basePath", {
        get: function () {
            return this._basePath;
        },
        set: function (basePath) {
            this._basePath = basePath;
        },
        enumerable: true,
        configurable: true
    });
    TemplateApi.prototype.setDefaultAuthentication = function (auth) {
        this.authentications.default = auth;
    };
    TemplateApi.prototype.setApiKey = function (key, value) {
        this.authentications[TemplateApiApiKeys[key]].apiKey = value;
    };
    TemplateApi.prototype.allTemplates = function (isPublished, name, version, owned, sortBy, sortOrder, tags, options) {
        if (options === void 0) { options = {}; }
        var localVarPath = this.basePath + '/template';
        var localVarQueryParameters = {};
        var localVarHeaderParams = Object.assign({}, this.defaultHeaders);
        var localVarFormParams = {};
        if (isPublished !== undefined) {
            localVarQueryParameters['isPublished'] = ObjectSerializer.serialize(isPublished, "boolean");
        }
        if (name !== undefined) {
            localVarQueryParameters['name'] = ObjectSerializer.serialize(name, "string");
        }
        if (version !== undefined) {
            localVarQueryParameters['version'] = ObjectSerializer.serialize(version, "string");
        }
        if (owned !== undefined) {
            localVarQueryParameters['owned'] = ObjectSerializer.serialize(owned, "boolean");
        }
        if (sortBy !== undefined) {
            localVarQueryParameters['sortBy'] = ObjectSerializer.serialize(sortBy, "'alphabetical' | 'dateCreated' | 'dateUpdated'");
        }
        if (sortOrder !== undefined) {
            localVarQueryParameters['sortOrder'] = ObjectSerializer.serialize(sortOrder, "'ascending' | 'descending'");
        }
        if (tags !== undefined) {
            localVarQueryParameters['tags'] = ObjectSerializer.serialize(tags, "string");
        }
        Object.assign(localVarHeaderParams, options.headers);
        var localVarUseFormData = false;
        var localVarRequestOptions = {
            method: 'GET',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };
        this.authentications.bearer_auth.applyToRequest(localVarRequestOptions);
        this.authentications.default.applyToRequest(localVarRequestOptions);
        if (Object.keys(localVarFormParams).length) {
            if (localVarUseFormData) {
                localVarRequestOptions.formData = localVarFormParams;
            }
            else {
                localVarRequestOptions.form = localVarFormParams;
            }
        }
        return new Promise(function (resolve, reject) {
            localVarRequest(localVarRequestOptions, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                else {
                    body = ObjectSerializer.deserialize(body, "TemplateList");
                    if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    }
                    else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
    };
    TemplateApi.prototype.createTemplate = function (body, options) {
        if (options === void 0) { options = {}; }
        var localVarPath = this.basePath + '/template';
        var localVarQueryParameters = {};
        var localVarHeaderParams = Object.assign({}, this.defaultHeaders);
        var localVarFormParams = {};
        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling createTemplate.');
        }
        Object.assign(localVarHeaderParams, options.headers);
        var localVarUseFormData = false;
        var localVarRequestOptions = {
            method: 'POST',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
            body: ObjectSerializer.serialize(body, "PostedTemplate")
        };
        this.authentications.bearer_auth.applyToRequest(localVarRequestOptions);
        this.authentications.default.applyToRequest(localVarRequestOptions);
        if (Object.keys(localVarFormParams).length) {
            if (localVarUseFormData) {
                localVarRequestOptions.formData = localVarFormParams;
            }
            else {
                localVarRequestOptions.form = localVarFormParams;
            }
        }
        return new Promise(function (resolve, reject) {
            localVarRequest(localVarRequestOptions, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                else {
                    body = ObjectSerializer.deserialize(body, "ResourceCreated");
                    if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    }
                    else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
    };
    TemplateApi.prototype.deleteTemplateById = function (templateId, version, options) {
        if (options === void 0) { options = {}; }
        var localVarPath = this.basePath + '/template/{templateId}'
            .replace('{' + 'templateId' + '}', encodeURIComponent(String(templateId)));
        var localVarQueryParameters = {};
        var localVarHeaderParams = Object.assign({}, this.defaultHeaders);
        var localVarFormParams = {};
        if (templateId === null || templateId === undefined) {
            throw new Error('Required parameter templateId was null or undefined when calling deleteTemplateById.');
        }
        if (version !== undefined) {
            localVarQueryParameters['version'] = ObjectSerializer.serialize(version, "string");
        }
        Object.assign(localVarHeaderParams, options.headers);
        var localVarUseFormData = false;
        var localVarRequestOptions = {
            method: 'DELETE',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };
        this.authentications.default.applyToRequest(localVarRequestOptions);
        if (Object.keys(localVarFormParams).length) {
            if (localVarUseFormData) {
                localVarRequestOptions.formData = localVarFormParams;
            }
            else {
                localVarRequestOptions.form = localVarFormParams;
            }
        }
        return new Promise(function (resolve, reject) {
            localVarRequest(localVarRequestOptions, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                else {
                    if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    }
                    else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
    };
    TemplateApi.prototype.getRecent = function (options) {
        if (options === void 0) { options = {}; }
        var localVarPath = this.basePath + '/template/recent';
        var localVarQueryParameters = {};
        var localVarHeaderParams = Object.assign({}, this.defaultHeaders);
        var localVarFormParams = {};
        Object.assign(localVarHeaderParams, options.headers);
        var localVarUseFormData = false;
        var localVarRequestOptions = {
            method: 'GET',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };
        this.authentications.bearer_auth.applyToRequest(localVarRequestOptions);
        this.authentications.default.applyToRequest(localVarRequestOptions);
        if (Object.keys(localVarFormParams).length) {
            if (localVarUseFormData) {
                localVarRequestOptions.formData = localVarFormParams;
            }
            else {
                localVarRequestOptions.form = localVarFormParams;
            }
        }
        return new Promise(function (resolve, reject) {
            localVarRequest(localVarRequestOptions, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                else {
                    body = ObjectSerializer.deserialize(body, "Recent");
                    if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    }
                    else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
    };
    TemplateApi.prototype.postTemplateById = function (templateId, body, options) {
        if (options === void 0) { options = {}; }
        var localVarPath = this.basePath + '/template/{templateId}'
            .replace('{' + 'templateId' + '}', encodeURIComponent(String(templateId)));
        var localVarQueryParameters = {};
        var localVarHeaderParams = Object.assign({}, this.defaultHeaders);
        var localVarFormParams = {};
        if (templateId === null || templateId === undefined) {
            throw new Error('Required parameter templateId was null or undefined when calling postTemplateById.');
        }
        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling postTemplateById.');
        }
        Object.assign(localVarHeaderParams, options.headers);
        var localVarUseFormData = false;
        var localVarRequestOptions = {
            method: 'POST',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
            body: ObjectSerializer.serialize(body, "PostedTemplate")
        };
        this.authentications.bearer_auth.applyToRequest(localVarRequestOptions);
        this.authentications.default.applyToRequest(localVarRequestOptions);
        if (Object.keys(localVarFormParams).length) {
            if (localVarUseFormData) {
                localVarRequestOptions.formData = localVarFormParams;
            }
            else {
                localVarRequestOptions.form = localVarFormParams;
            }
        }
        return new Promise(function (resolve, reject) {
            localVarRequest(localVarRequestOptions, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                else {
                    if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    }
                    else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
    };
    TemplateApi.prototype.templateById = function (templateId, isPublished, version, options) {
        if (options === void 0) { options = {}; }
        var localVarPath = this.basePath + '/template/{templateId}'
            .replace('{' + 'templateId' + '}', encodeURIComponent(String(templateId)));
        var localVarQueryParameters = {};
        var localVarHeaderParams = Object.assign({}, this.defaultHeaders);
        var localVarFormParams = {};
        if (templateId === null || templateId === undefined) {
            throw new Error('Required parameter templateId was null or undefined when calling templateById.');
        }
        if (isPublished !== undefined) {
            localVarQueryParameters['isPublished'] = ObjectSerializer.serialize(isPublished, "boolean");
        }
        if (version !== undefined) {
            localVarQueryParameters['version'] = ObjectSerializer.serialize(version, "string");
        }
        Object.assign(localVarHeaderParams, options.headers);
        var localVarUseFormData = false;
        var localVarRequestOptions = {
            method: 'GET',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };
        this.authentications.bearer_auth.applyToRequest(localVarRequestOptions);
        this.authentications.default.applyToRequest(localVarRequestOptions);
        if (Object.keys(localVarFormParams).length) {
            if (localVarUseFormData) {
                localVarRequestOptions.formData = localVarFormParams;
            }
            else {
                localVarRequestOptions.form = localVarFormParams;
            }
        }
        return new Promise(function (resolve, reject) {
            localVarRequest(localVarRequestOptions, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                else {
                    body = ObjectSerializer.deserialize(body, "TemplateList");
                    if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    }
                    else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
    };
    TemplateApi.prototype.templatePreview = function (templateId, version, options) {
        if (options === void 0) { options = {}; }
        var localVarPath = this.basePath + '/template/{templateId}/preview'
            .replace('{' + 'templateId' + '}', encodeURIComponent(String(templateId)));
        var localVarQueryParameters = {};
        var localVarHeaderParams = Object.assign({}, this.defaultHeaders);
        var localVarFormParams = {};
        if (templateId === null || templateId === undefined) {
            throw new Error('Required parameter templateId was null or undefined when calling templatePreview.');
        }
        if (version === null || version === undefined) {
            throw new Error('Required parameter version was null or undefined when calling templatePreview.');
        }
        if (version !== undefined) {
            localVarQueryParameters['version'] = ObjectSerializer.serialize(version, "string");
        }
        Object.assign(localVarHeaderParams, options.headers);
        var localVarUseFormData = false;
        var localVarRequestOptions = {
            method: 'GET',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };
        this.authentications.default.applyToRequest(localVarRequestOptions);
        if (Object.keys(localVarFormParams).length) {
            if (localVarUseFormData) {
                localVarRequestOptions.formData = localVarFormParams;
            }
            else {
                localVarRequestOptions.form = localVarFormParams;
            }
        }
        return new Promise(function (resolve, reject) {
            localVarRequest(localVarRequestOptions, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                else {
                    body = ObjectSerializer.deserialize(body, "TemplatePreview");
                    if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    }
                    else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
    };
    return TemplateApi;
}());
exports.TemplateApi = TemplateApi;
var UserApiApiKeys;
(function (UserApiApiKeys) {
    UserApiApiKeys[UserApiApiKeys["bearer_auth"] = 0] = "bearer_auth";
})(UserApiApiKeys = exports.UserApiApiKeys || (exports.UserApiApiKeys = {}));
var UserApi = (function () {
    function UserApi(basePathOrUsername, password, basePath) {
        this._basePath = defaultBasePath;
        this.defaultHeaders = {};
        this._useQuerystring = false;
        this.authentications = {
            'default': new VoidAuth(),
            'bearer_auth': new ApiKeyAuth('header', 'Authorization'),
        };
        if (password) {
            if (basePath) {
                this.basePath = basePath;
            }
        }
        else {
            if (basePathOrUsername) {
                this.basePath = basePathOrUsername;
            }
        }
    }
    Object.defineProperty(UserApi.prototype, "useQuerystring", {
        set: function (value) {
            this._useQuerystring = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserApi.prototype, "basePath", {
        get: function () {
            return this._basePath;
        },
        set: function (basePath) {
            this._basePath = basePath;
        },
        enumerable: true,
        configurable: true
    });
    UserApi.prototype.setDefaultAuthentication = function (auth) {
        this.authentications.default = auth;
    };
    UserApi.prototype.setApiKey = function (key, value) {
        this.authentications[UserApiApiKeys[key]].apiKey = value;
    };
    UserApi.prototype.userDelete = function (options) {
        if (options === void 0) { options = {}; }
        var localVarPath = this.basePath + '/user';
        var localVarQueryParameters = {};
        var localVarHeaderParams = Object.assign({}, this.defaultHeaders);
        var localVarFormParams = {};
        Object.assign(localVarHeaderParams, options.headers);
        var localVarUseFormData = false;
        var localVarRequestOptions = {
            method: 'DELETE',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };
        this.authentications.bearer_auth.applyToRequest(localVarRequestOptions);
        this.authentications.default.applyToRequest(localVarRequestOptions);
        if (Object.keys(localVarFormParams).length) {
            if (localVarUseFormData) {
                localVarRequestOptions.formData = localVarFormParams;
            }
            else {
                localVarRequestOptions.form = localVarFormParams;
            }
        }
        return new Promise(function (resolve, reject) {
            localVarRequest(localVarRequestOptions, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                else {
                    if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    }
                    else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
    };
    UserApi.prototype.userGet = function (options) {
        if (options === void 0) { options = {}; }
        var localVarPath = this.basePath + '/user';
        var localVarQueryParameters = {};
        var localVarHeaderParams = Object.assign({}, this.defaultHeaders);
        var localVarFormParams = {};
        Object.assign(localVarHeaderParams, options.headers);
        var localVarUseFormData = false;
        var localVarRequestOptions = {
            method: 'GET',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };
        this.authentications.bearer_auth.applyToRequest(localVarRequestOptions);
        this.authentications.default.applyToRequest(localVarRequestOptions);
        if (Object.keys(localVarFormParams).length) {
            if (localVarUseFormData) {
                localVarRequestOptions.formData = localVarFormParams;
            }
            else {
                localVarRequestOptions.form = localVarFormParams;
            }
        }
        return new Promise(function (resolve, reject) {
            localVarRequest(localVarRequestOptions, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                else {
                    body = ObjectSerializer.deserialize(body, "UserList");
                    if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    }
                    else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
    };
    UserApi.prototype.userPost = function (body, options) {
        if (options === void 0) { options = {}; }
        var localVarPath = this.basePath + '/user';
        var localVarQueryParameters = {};
        var localVarHeaderParams = Object.assign({}, this.defaultHeaders);
        var localVarFormParams = {};
        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling userPost.');
        }
        Object.assign(localVarHeaderParams, options.headers);
        var localVarUseFormData = false;
        var localVarRequestOptions = {
            method: 'POST',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
            body: ObjectSerializer.serialize(body, "PostedUser")
        };
        this.authentications.bearer_auth.applyToRequest(localVarRequestOptions);
        this.authentications.default.applyToRequest(localVarRequestOptions);
        if (Object.keys(localVarFormParams).length) {
            if (localVarUseFormData) {
                localVarRequestOptions.formData = localVarFormParams;
            }
            else {
                localVarRequestOptions.form = localVarFormParams;
            }
        }
        return new Promise(function (resolve, reject) {
            localVarRequest(localVarRequestOptions, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                else {
                    if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    }
                    else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
    };
    return UserApi;
}());
exports.UserApi = UserApi;
//# sourceMappingURL=api.js.map