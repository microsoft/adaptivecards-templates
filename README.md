
# Adaptive Cards Template Repository

This repo contains a variety of [Adaptive Card](https://adaptivecards.io) templates for common data sources.

## Using the template service

The template service offers 3 main functions:

1. Download a JSON template, use the `adaptivecards-templating` library to data-bind the template to data, and render the Adaptive Card
2. 
3. Aren't sure if a template exists for your data? Just **POST** to the `find` endpoint and search for matches templates

## Contributing of editing templates

Anyone can contribute templates to the repository, and it's easy to make modifications: just edit the file and open a PR!


## Deploy the service to your own Azure subscription

### Get a template

`HTTP GET https://templates.adaptivecards.io/<name>`

**Example**

`HTTP GET https://templates.adaptivecards.io/schema.org/Restaurant.json`



## Lookup options

`HTTP GET https://templates.adaptivecards.io/find?odata.type=%23microsoft.graph.user`



## Build templating service

### Install Azure Functions Tools 

**On macOS**, install using Homebrew

```console
$ brew tap azure/functions
$ brew install azure-functions-core-tools
```

**On Windows**, install using npm.

```console
$ npm install -g azure-functions-core-tools
```

**On Linux**, follow the instructions in the Azure Functions Core Tools [GitHub repository](https://github.com/Azure/azure-functions-core-tools#linux).


### Update **local.settings.json** to point to a Storage account

The JSON template files get copied from the Git repo into Blob storage and the Function serves them from there.

```console
cd src
func extensions sync
```



```json
"AzureWebJobsStorage": "DefaultEndpointsProtocol=https;AccountName=XXXXXXX;AccountKey=XXXXXXXXXX",
```

F5
