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
const client = TemplateServiceClient.init(clientOptions);
app.use("/template", client.expressMiddleware());
```

Using TemplateServiceClient's expressMiddleware sets up basic GET, POST endpoints and will allow searching for template names, by version, etc.

### Using Template Service Client without Express

```
let client : TemplateServiceClient = TemplateServiceClient.init(clientOptions);

TemplateServiceClient.getTemplates(templateId, templateName, version);

TemplateServiceClient.postTemplates(template, templateId, version);
```

## Developer Instructions

In `adaptivecards-templating-service`, run `npm link`.
In `server`, run `npm link adaptivecards-templating-service`.

#### After making changes to adaptivecards-templating-service
In `adaptivecards-templating-service` run `tsc`.
The web server will now be able to access the newest version of the package.

In `server` run `npm run start`.

### Troubleshooting
##### Missing declaration (d.ts) file for adaptivecards-templating-service
Go to `types/adaptivecards-templating-service` and copy `index.d.ts` into `server/src/index.d.ts`.
In `server` run `npm run start`.

# Server Models

```javascript
interface ITemplateInstance {
    _id?: string;
	json: string;
	version: string;
	publishedAt?: Date; // time when "live"
	state?: string; // "draft" | "live" | "deprecated" 
	isShareable?: boolean;
	numHits?: number;
	data?: string[];
	updatedAt?: Date;
	createdAt?: Date; 
}

interface ITemplate {
	_id?: string;
	name: string;
	owner: string;
	instances?: ITemplateInstance[];
	tags?: string[];
    deletedVersions?: string[];
    isLive?: boolean; // at least one version is published
	createdAt?: Date;   // for sorting
	updatedAt?: Date;   // for sorting
}
    
interface User {
	_id?: string;
	authId: string;
	issuer: string;
	firstName: string;
	lastName: string;
	team?: string[];
	org?: string[];
	recentlyViewed?: string[]; // max size 5
    recentlyEdited?: string[]; // max size 5
    recentTags?: string[]; // max size 10
}
```

# Backend Endpoints

All endpoints required Authorization header, unless otherwise noted.
**HEADER**

```json
{
	"Authorization": "Bearer <ACCESS_TOKEN>"
}
```

**<u>Client Flag</u>**
If the React frontend is accessing any of the below GET requests on /template, add the follow flag to the body of your request for hit tracking. 
**BODY**

```json
{
	"isClient": true
}
```



## /template

- ### **GET**

###### Description
Returns the latest version of all published and owned templates. 
###### Sample Response
```json
{
	"templates": [
		{
			"_id": "123",
			"name": "Untitled Template",
			"instances": [
                {
                    "version": "1.6",
                    "json": {},
                    "updatedAt": "2020-02-14T19:16:22.162Z",
                    "createdAt": "2020-02-14T19:16:22.162Z",
                    "publishedAt": "2020-02-14T19:16:22.162Z",
                    "state": "draft",
                    "isShareable": false,
                    "numHits": 10,
                    "data": [
                        {}
                    ]
                }
              ],
			"tags": [
                "Contosa",
                "Weather"
            ],
			"owner": {
				"firstName": "Em",
				"lastName": "ployee",
				"team": ["Contosa", "NotTeams"],
				"org": ["Microsoft"]
			}
		}, 
		{
			...
		}
	]
}
```

#### Query Params

***GET /template?isPublished=true*** : Returns the newest published (live) version of all templates

**GET /template?isPublished=false**: Returns the newest draft versions of all templates

***GET /template?sortBy=alphabetical&sortOrder=ascending*** : Returns the newest version of all published and owned templates sorted alphabetically

***GET /template?sortBy=dateCreated&sortOrder=descending*** 

***GET /template?name=Test*** : Search by name and tags

***GET /template?owned=true*** : Returns the newest version of all owned templates (includes unpublished and published templates)

***GET /template?owned=false*** : Returns the newest version of all published templates not owned by logged in user

***GET /template?tags=weather,sunny***:  Filters by given tags.

- ### GET /recent: 
##### Description
Retrieves a list of recent templates viewed by the logged in user.

##### Sample Response

```json
{
	"recentlyViewed": {
		"templates": [
            {
                "_id": "123",
                "name": "Untitled Template",
                "instance": 
                    {
                        "version": "1.0",
                        "json": {},
                        "updatedAt": "2020-02-14T19:16:22.162Z",
                        "createdAt": "2020-02-14T19:16:22.162Z",
                        "publishedAt": "2020-02-14T19:16:22.162Z",
                        "state": "draft", 
                        "isShareable": false,
                        "numHits": 10,
                        "data": []
                    },
               "tags": [
                   "Contosa"
               ],
               "owner": {
                   "firstName": "Em",
                   "lastName": "ployee",
                   "team": ["Contosa", "NotTeams"],
                   "org": ["Microsoft"]     		   
                }
            }
		]
	}, 
	"recentlyEdited": {
		"templates": []
	}, 
	"recentlyUsed": {
		"tags": []
	}
}
```

- ### **GET /tag:**
##### Description
Returns list of all tags separated into tags that the user has used for owned templates and tags that exist on published templates.

##### Sample Response

```json
{
	"ownedTags": [
		"Contosa",
		"Weather",
        "MyTagOnly",
	], 
    "allTags": [
        "Weather",
        "Contosa",
    ]
}
```

- ### **GET /{template_id}** : 
###### Description
Returns all versions of the requested template. This endpoint updates the numHits field of the template instance. Not specifying the version of the template updates all instances by one hit, specifying specific version increments on that version.
###### Sample Response
```json
{
	"templates": [
       {
		"_id": "123",
		"name": "Untitled Template",
		"instances": [
			{
				"version": "1.0",
				"json": {},
				"updatedAt": "2020-02-14T19:16:22.162Z",
				"createdAt": "2020-02-14T19:16:22.162Z",
				"publishedAt": "2020-02-14T19:16:22.162Z",
				"state": "draft", 
				"isShareable": false,
				"numHits": 10,
                "data": []
			},
			{
				"version": "1.1",
				"json": {},
				"updatedAt": "2020-02-14T19:16:22.162Z",
				"createdAt": "2020-02-14T19:16:22.162Z",
				"publishedAt": "2020-02-14T19:16:22.162Z",
				"state": "live",
				"isShareable": false,
				"numHits": 8,
                "data": []
			}
		],
       "tags": [
           "Contosa"
       ],
       "owner": {
           "firstName": "Em",
           "lastName": "ployee",
           "team": ["Contosa", "NotTeams"],
           "org": ["Microsoft"]     		   
        }      
	}
  ]
}
```

###### Query Params
***GET /template/{template_id}?isPublished=true*** : Returns all published versions of this template

***GET /template/{template_id}?isPublished=false***: Returns all draft versions of this template

***GET /template/{template_id}?version=1.0***: Returns specific version of template 

- ### **GET /{template_id}/preview** : 
##### Description
Retrieve a preview of the latest shareable version of a template. 

### Query Params

***GET /template/{template_id}/preview?version=1.2*** : Retrieve a preview of the specified version of a template if it is shareable.

##### Sample Response
```json
{
	"template": {
		"_id": "123",
		"name": "Untitled Template",
		"instance":{
            "version": "1.0",
            "json": {},
            "state": "draft",
            "data": [
                {}
            ]
		},
       "tags": [
           "Contosa"
       ],
       "owner": {
           "firstName": "Em",
           "lastName": "ployee",
           "team": ["Contosa", "NotTeams"],
           "org": ["Microsoft"]     		   
        }  
	}
}
```

- ### **POST**
###### Description
Creates a new template instance and template object.
###### Body
```json
{
    "name": "Untitled Template", // optional, default "Untitled Template"
    "version": "1.0",            // optional, default 1.0
	"template": {},
	"state": "draft",            // optional, default draft
	"isShareable": true,         // optional, default false
    "isPublished": false,        // optional, default false
	"tags": [ "Contosa" ],       // optional, default no tags
	"data": [                    // optional, default empty
		{...},
		{...}
	]   
}
```

##### Default Query

Default POST with only the template parameter passed should return the following response: 

```json
{
    "templates": [
        {
            "name": "Untitled Template",
            "owner": "123",
            "instances": [
                {
                    "json": "\"{}\"",
                    "version": "1.0",
                    "state": "draft",
                    "isShareable": false,
                    "numHits": 0,
                    "data": [],
                    "updatedAt": "2020-02-20T19:14:24.772Z"
                }
            ],
            "deletedVersions": [],
            "isLive": false,
            "updatedAt": "2020-02-20T19:14:24.772Z",
            "createdAt": "2020-02-20T19:14:24.772Z",
            "_id": "123"
        }
    ]
}
```



- ### POST/{template_id}
###### Description
Creates new template version or updates existing template or template version. 

**Updating data for templates**
Passing in data as an array will remove all current data associated with the template instance. 
Passing in data as a single entry will add the data to the current list.
**Updating tags for templates**
Passing an array of tags will replace all tags associated with the template instance. 
Passing in a single tag will append to the existing list.

<u>***When posting an update to a version of template to unpublish from live state, the client MUST specify deprecated" as the state as well as the version. Templates that are in "draft" or "live" can be deprecated by passing the version as well as "deprecated" as the state. If no version is specified, the version will default to incrementing the largest version. If a "deprecated" or "live" template is modified, a new template will be created with a vesrion that is auto incremented from the largest version.***</u> 

###### Body
```json
{
	"template": {},
	"version": "1.2",
	"state": "live", 
	"isShareable": true, 
	"tags": [
       "NotContosa"      // This replaces any existing tags associated with template (array)
    ],
	"data": [
		{}
	],
	"name": "Titled Template" // This value changes the template name for all template versions
}
```

#### Unpublishing/republishing multiple versions of a template 

**PATCH /template/{template_id}/batchUnpublish**

This endpoint checks that the template versions must be in the state "live" and are changed to state "deprecated" if this operation is successful. Only the versions that fulfill the check will be updated.

**PATCH /template/{template_id}/batchRepublish**

This endpoint checks that the template versions must be in the state "deprecated" and are changed to state "live" if this operation is successful. Only the versions that fulfill the check will be updated.

**Body**

```json
{
    versions: [
        "1.0",
        "1.2"
    ]
}
```



- ### DELETE /{template_id}
###### Description
Deletes the most recent version of the template.

### Query Params

**DELETE /template/{template_id}?version=1.2*** : Delete a specific version of the template, this version can never be reposted. If the only version of the template is deleted, the entire template is removed.

https://stackoverflow.com/questions/21863326/delete-multiple-records-using-rest?noredirect=1&lq=1

#### Deleting multiple versions of a template 
**POST /template/{template_id}/batchDelete**

###### Body
```json
{
	versions: [
		"1.0",
		"1.2"
	]
}
```

### /user
- ### **GET**
###### Description
Get current logged in user information.
###### Sample Response
```json
{
	"_id": "1234",
	"firstName": "Em",
	"lastName": "Ployee",
	"authId": "123",
	"issuer": "AzureAD",
	"team": ["Contosa"],
	"org": ["Microsoft"]
}
```
- ### **POST**

  Body

  ```json
  {
      firstName: "",
      lastName: "",
      team: [
          "Contosa",
          "Contosa2"
      ],
      org: [
          "Microsoft"
      ]
  }
  ```

  

- ### **DELETE**
###### Description
Deletes all information about the logged in user. This operation default only deletes all draft templates owned by the user.

