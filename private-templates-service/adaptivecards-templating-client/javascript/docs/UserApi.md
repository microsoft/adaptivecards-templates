# AdaptivecardsTemplatingServiceJavascriptSdk.UserApi

All URIs are relative to *https://adaptivecms.azurewebsites.net*

Method | HTTP request | Description
------------- | ------------- | -------------
[**userDelete**](UserApi.md#userDelete) | **DELETE** /user | Delete all user info
[**userGet**](UserApi.md#userGet) | **GET** /user | Get user's info


<a name="userDelete"></a>
# **userDelete**
> User userDelete()

Delete all user info

Delete all user info and user owner templates

### Example
```javascript
var AdaptivecardsTemplatingServiceJavascriptSdk = require('adaptivecards_templating_service_javascript_sdk');
var defaultClient = AdaptivecardsTemplatingServiceJavascriptSdk.ApiClient.instance;

// Configure API key authorization: bearer_auth
var bearer_auth = defaultClient.authentications['bearer_auth'];
bearer_auth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearer_auth.apiKeyPrefix = 'Token';

var apiInstance = new AdaptivecardsTemplatingServiceJavascriptSdk.UserApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.userDelete(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**User**](User.md)

### Authorization

[bearer_auth](../README.md#bearer_auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="userGet"></a>
# **userGet**
> User userGet()

Get user's info

Returns user's info

### Example
```javascript
var AdaptivecardsTemplatingServiceJavascriptSdk = require('adaptivecards_templating_service_javascript_sdk');
var defaultClient = AdaptivecardsTemplatingServiceJavascriptSdk.ApiClient.instance;

// Configure API key authorization: bearer_auth
var bearer_auth = defaultClient.authentications['bearer_auth'];
bearer_auth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearer_auth.apiKeyPrefix = 'Token';

var apiInstance = new AdaptivecardsTemplatingServiceJavascriptSdk.UserApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.userGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**User**](User.md)

### Authorization

[bearer_auth](../README.md#bearer_auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

