# Using ACMS with Microsoft Power Automate

### Overview
Microsoft Power Automate is a platform where you can create automated workflows without coding. By creating a customer connector, users can integrate the ACMS API seamlessly into power automate flows. The following instruction will lead you setp-by-step how to create a customer connector that connects your own ACMS API and power automate account and provide an example of how to use the customer connector into flows.

### Step1. Creating a Custom Connector

#### Prerequisites
-   Azure Active Directory App Registration 
-   ACMS ([instructions on deploying ACMS](https://github.com/microsoft/adaptivecards-templates/blob/dev/private-templates-service/README.md))

#### Instructions
1. **Navigate to 'Custom connectors' under the Data header on the navigation bar on the left side of [Microsoft Flow](https://flow.microsoft.com/).** 
2. **Under the 'General' step, add the URL of the ACMS admin portal under the 'Host' field. Provide any additional information eg. a description for your connector and move to 'Security'.**
3. **Under 'Authentication type', select 'OAuth 2.0'.** 
4. **Navigate to [Azure Portal](https://portal.azure.com/) and navigate to Azure Active Directory and to your App Registration.**
5. **Select 'Overview' and save the 'Application (client) ID' value.**
6. **Select 'Certificates & secrets' under the 'Manage' heading on the navigation bar on the left side. Create a new Client secret and save the value. Keep this tab open, we will make updates to the app registration in later steps.** 
7. **Return back to the 'Security' section in the Flow and select 'Azure Active Directory' as the 'Identity Provider'.**
8. **Copy the 'Application (client) ID' from step 5 into the 'Client id' field. Copy the client secret from step 6 into the 'Client secret' field. Copy the 'Application (client) ID from step 5 into the 'Resource URL field.**
9. **Save your changes by clicking 'Create/Update connector'.**
10. **Save the value of the 'Redirect URL' under the 'OAuth 2.0' header.** 
11. **Return back to the AAD App Registration page and navigate to 'Authentication' under the 'Manage' heading. Paste the redirect URI from step 10 under the 'Redirect URIs' and save.** 
12. **Return back to the private connector in Flow and proceed to the 'Definition' section. Toggle the 'Swagger Editor' switch and copy and paste the [swagger YAML file](https://github.com/microsoft/adaptivecards-templates/blob/users/grzhan/flow/private-templates-service/flow/flow-swagger.yaml) from this repo.** 
13. **Save your changes by clicking 'Update connector'. Proceed to the 'Test' section. Select 'New connection' and login with your Microsoft account and test the endpoints.** 

The default connector definition from the swagger YAML file has two main operations: 

1. GetTemplate: Returns the template JSON given the version and templateId
2. RenderTemplate: Returns a data-bound card JSON given the version, templateId, and data JSON


### Step2. Creating a Flow with the Custom Connector

This example flow will use the private connector we created from the steps listed under 'Creating a Custom Connector' and post the adaptive card to a Microsoft Teams channel. 

#### Prerequisites

-   ACMS private connector (Step 1)

#### Instructions
1. **Add a manual trigger ('Manually trigger a flow') with inputs for a data string, template id string, and version string.**

2.  **Select insert a new step and add an action. Search for the private connector that you created previously. Select 'Get data populated template'.**

3. **Select the 'Menu' button in the upper right of the connector and select 'Add new connection'. Login to your Microsoft account and save the flow.** 

4. **In the 'templateId' and 'version' field, select the respective parameters from the manual trigger step.** 

5. **In the 'data' field, add the following function to convert the 'data' string from the manual trigger step to json: `json(triggerBody()['text'])`.**

6. **Insert another step and add an action. Search for the 'Parse JSON' data operation.**

7. **Under 'Content' of the 'Parse JSON' step, add the body from 'Get data populated template'.** 

8. **Under 'Schema' of the 'Parse JSON' step, add the following JSON:** 

   ```json
   {
       "type": "object",
       "properties": {
           "templates": {
               "type": "array",
               "items": {
                   "type": "object",
                   "properties": {
                       "_id": {
                           "type": "string"
                       },
                       "authors": {
                           "type": "array",
                           "items": {
                               "type": "string"
                           }
                       },
                       "tags": {
                           "type": "array",
                           "items": {
                               "type": "string"
                           }
                       },
                       "deletedVersions": {
                           "type": "array"
                       },
                       "isLive": {
                           "type": "boolean"
                       },
                       "name": {
                           "type": "string"
                       },
                       "instances": {
                           "type": "array",
                           "items": {
                               "type": "object",
                               "properties": {
                                   "state": {
                                       "type": "string"
                                   },
                                   "isShareable": {
                                       "type": "boolean"
                                   },
                                   "numHits": {
                                       "type": "integer"
                                   },
                                   "data": {},
                                   "lastEditedUser": {
                                       "type": "string"
                                   },
                                   "json": {},
                                   "version": {
                                       "type": "string"
                                   },
                                   "author": {
                                       "type": "string"
                                   },
                                   "updatedAt": {
                                       "type": "string"
                                   },
                                   "_id": {
                                       "type": "string"
                                   },
                                   "createdAt": {
                                       "type": "string"
                                   }
                               },
                               "required": [
                                   "state",
                                   "isShareable",
                                   "numHits",
                                   "data",
                                   "lastEditedUser",
                                   "json",
                                   "version",
                                   "author",
                                   "updatedAt",
                                   "_id",
                                   "createdAt"
                               ]
                           }
                       },
                       "updatedAt": {
                           "type": "string"
                       },
                       "createdAt": {
                           "type": "string"
                       }
                   },
                   "required": [
                       "_id",
                       "authors",
                       "tags",
                       "deletedVersions",
                       "isLive",
                       "name",
                       "instances",
                       "updatedAt",
                       "createdAt"
                   ]
               }
           }
       }
   }
   ```

9. **Insert a new step and add an action. Select the 'Post your own adaptive card as the Flow bot to a channel' connector.** 
10. **Select the 'Team' and 'Channel' that you wish to upload the adaptive card to.** 
11. **Under 'Message', add the following function to parse the JSON: `body('Parse_JSON')['templates'][0]['instances'][0]['json']`.** 

Final Flow using the private connector and Teams: 

![Microsoft Flow example](https://github.com/microsoft/adaptivecards-templates/blob/dev/private-templates-service/flow/screenshots/flow.jpg?raw=true)
