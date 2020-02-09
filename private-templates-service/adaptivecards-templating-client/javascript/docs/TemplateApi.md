# AdaptivecardsTemplatingServiceJavascriptSdk.TemplateApi

All URIs are relative to *https://https://adaptivecms.azurewebsites.net*

Method | HTTP request | Description
------------- | ------------- | -------------
[**templateById**](TemplateApi.md#templateById) | **GET** /template/{templateId} | Find template by id
[**templateGet**](TemplateApi.md#templateGet) | **GET** /template | Find all templates
[**templatePost**](TemplateApi.md#templatePost) | **POST** /template | Add a new template


<a name="templateById"></a>
# **templateById**
> Template templateById(templateId)

Find template by id

Returns a single template

### Example
```javascript
var AdaptivecardsTemplatingServiceJavascriptSdk = require('adaptivecards_templating_service_javascript_sdk');
var defaultClient = AdaptivecardsTemplatingServiceJavascriptSdk.ApiClient.instance;

// Configure API key authorization: bearer_auth
var bearer_auth = defaultClient.authentications['bearer_auth'];
bearer_auth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearer_auth.apiKeyPrefix = 'Token';

var apiInstance = new AdaptivecardsTemplatingServiceJavascriptSdk.TemplateApi();

var templateId = "templateId_example"; // String | ID of template to return


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.templateById(templateId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **templateId** | **String**| ID of template to return | 

### Return type

[**Template**](Template.md)

### Authorization

[bearer_auth](../README.md#bearer_auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="templateGet"></a>
# **templateGet**
> TemplateList templateGet()

Find all templates

Returns all public templates and owned templates

### Example
```javascript
var AdaptivecardsTemplatingServiceJavascriptSdk = require('adaptivecards_templating_service_javascript_sdk');
var defaultClient = AdaptivecardsTemplatingServiceJavascriptSdk.ApiClient.instance;

// Configure API key authorization: bearer_auth
var bearer_auth = defaultClient.authentications['bearer_auth'];
bearer_auth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearer_auth.apiKeyPrefix = 'Token';

var apiInstance = new AdaptivecardsTemplatingServiceJavascriptSdk.TemplateApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.templateGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**TemplateList**](TemplateList.md)

### Authorization

[bearer_auth](../README.md#bearer_auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="templatePost"></a>
# **templatePost**
> templatePost(body)

Add a new template



### Example
```javascript
var AdaptivecardsTemplatingServiceJavascriptSdk = require('adaptivecards_templating_service_javascript_sdk');
var defaultClient = AdaptivecardsTemplatingServiceJavascriptSdk.ApiClient.instance;

// Configure API key authorization: bearer_auth
var bearer_auth = defaultClient.authentications['bearer_auth'];
bearer_auth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//bearer_auth.apiKeyPrefix = 'Token';

var apiInstance = new AdaptivecardsTemplatingServiceJavascriptSdk.TemplateApi();

var body = new AdaptivecardsTemplatingServiceJavascriptSdk.NewTemplate(); // NewTemplate | Template object to be added


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.templatePost(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**NewTemplate**](NewTemplate.md)| Template object to be added | 

### Return type

null (empty response body)

### Authorization

[bearer_auth](../README.md#bearer_auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

