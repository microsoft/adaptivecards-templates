"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var localVarRequest = require("request");
var Promise = require("bluebird");
var defaultBasePath = 'http://adaptivecms.azurewebsites.net';
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
            "name": "isPublished",
            "baseName": "isPublished",
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
        }
    ];
    return Template;
}());
exports.Template = Template;
var TemplateInstance = (function () {
    function TemplateInstance() {
    }
    TemplateInstance.getAttributeTypeMap = function () {
        return TemplateInstance.attributeTypeMap;
    };
    TemplateInstance.discriminator = undefined;
    TemplateInstance.attributeTypeMap = [
        {
            "name": "json",
            "baseName": "json",
            "type": "string"
        },
        {
            "name": "version",
            "baseName": "version",
            "type": "string"
        }
    ];
    return TemplateInstance;
}());
exports.TemplateInstance = TemplateInstance;
var TemplateJSON = (function () {
    function TemplateJSON() {
    }
    TemplateJSON.getAttributeTypeMap = function () {
        return TemplateJSON.attributeTypeMap;
    };
    TemplateJSON.discriminator = undefined;
    TemplateJSON.attributeTypeMap = [
        {
            "name": "template",
            "baseName": "template",
            "type": "string"
        },
        {
            "name": "isPublished",
            "baseName": "isPublished",
            "type": "boolean"
        },
        {
            "name": "name",
            "baseName": "name",
            "type": "string"
        }
    ];
    return TemplateJSON;
}());
exports.TemplateJSON = TemplateJSON;
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
            "name": "issuer",
            "baseName": "issuer",
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
var enumsMap = {};
var typeMap = {
    "BaseError": BaseError,
    "BaseErrorError": BaseErrorError,
    "ResourceCreated": ResourceCreated,
    "Template": Template,
    "TemplateInstance": TemplateInstance,
    "TemplateJSON": TemplateJSON,
    "TemplateList": TemplateList,
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
    TemplateApi.prototype.templateById = function (templateId, options) {
        if (options === void 0) { options = {}; }
        var localVarPath = this.basePath + '/template/{templateId}'
            .replace('{' + 'templateId' + '}', encodeURIComponent(String(templateId)));
        var localVarQueryParameters = {};
        var localVarHeaderParams = Object.assign({}, this.defaultHeaders);
        var localVarFormParams = {};
        if (templateId === null || templateId === undefined) {
            throw new Error('Required parameter templateId was null or undefined when calling templateById.');
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
    TemplateApi.prototype.templateGet = function (isPublished, name, version, owned, options) {
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
    TemplateApi.prototype.templatePost = function (body, options) {
        if (options === void 0) { options = {}; }
        var localVarPath = this.basePath + '/template';
        var localVarQueryParameters = {};
        var localVarHeaderParams = Object.assign({}, this.defaultHeaders);
        var localVarFormParams = {};
        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling templatePost.');
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
            body: ObjectSerializer.serialize(body, "TemplateJSON")
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
    TemplateApi.prototype.templateTemplateIdPost = function (templateId, body, options) {
        if (options === void 0) { options = {}; }
        var localVarPath = this.basePath + '/template/{templateId}'
            .replace('{' + 'templateId' + '}', encodeURIComponent(String(templateId)));
        var localVarQueryParameters = {};
        var localVarHeaderParams = Object.assign({}, this.defaultHeaders);
        var localVarFormParams = {};
        if (templateId === null || templateId === undefined) {
            throw new Error('Required parameter templateId was null or undefined when calling templateTemplateIdPost.');
        }
        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling templateTemplateIdPost.');
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
            body: ObjectSerializer.serialize(body, "TemplateJSON")
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
    return UserApi;
}());
exports.UserApi = UserApi;
//# sourceMappingURL=api.js.map