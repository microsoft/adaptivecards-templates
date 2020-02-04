## Installation

##### Via npm 

`npm install adaptivecards-templating-service`

`import { TemplateServiceClient } from 'adaptivecards-templating-service'`;



###  Initialize Template Service Client with an authentication and storage provider with Express

```
const clientOptions : ClientOptions = {
	authenticationProvider: new AzureADProvider(),
	storageProvider: new MongoDbProvider()
}

// Intiatiate instance of template service client
TemplateServiceClient.init(clientOptions).then(
	(client) => { 
		app.use("/template", client.expressMiddleware());
	}
)
```

Using TemplateServiceClient's expressMiddleware sets up basic GET, POST endpoints and will allow searching for template names, by version, etc.

### Using Template Service Client without Express

```
let client : TemplateServiceClient = await TemplateServiceClient.init(clientOptions);

TemplateServiceClient.getTemplates(templateId, templateName, version);

TemplateServiceClient.postTemplates(template, templateId, version);
```

### Developer Instructions

In `adaptivecards-templating-service`, run `npm link`.
In `server`, run `npm link adaptivecards-templating-service`.

##### After making changes to adaptivecards-templating-service
In `adaptivecards-templating-service` run `tsc`.
The web server will now be able to access the newest version of the package.

In `server` run `npm run start`.