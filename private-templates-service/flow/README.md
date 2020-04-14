# Using ACMS with Microsoft Flow

### Creating a Custom Connector

Prerequisites:
-   Azure Active Directory App Registration 
-   ACMS ([instructions on deploying ACMS](https://github.com/microsoft/adaptivecards-templates/blob/dev/private-templates-service/README.md))

1. **Navigate to Custom connectors under the Data header.** 
2. **Under the 'General' step, add the URL of the ACMS admin portal under the 'Host' field. Provide any additional information eg. a description for your connector and move to 'Security'.**
3. **Under 'Authentication type', select 'OAuth 2.0'.** 
4. **Navigate to [Azure Portal](https://portal.azure.com/) and navigate to Azure Active Directory and to your App Registration.**
5. **Select 'Overview' and save the 'Application (client) ID' value.**
6. **Select 'Certificates & secrets' under the 'Manage' heading. Create a new Client secret and save the value. Keep this tab open, we will make updates to the app registration in later steps.** 
7. **Return back to the 'Security' section in the Flow and select 'Azure Active Directory' as the 'Identity Provider'.**
8. **Copy the 'Application (client) ID' from step 5 into the 'Client id' field. Copy the client secret from step 6 into the 'Client secret' field. Copy the 'Application (client) ID from step 5 into the 'Resource URL field.**
9. **Save your changes by clicking 'Update connector'.**
10. **Save the value of the 'Redirect URL' under the 'OAuth 2.0' header.** 
11. **Return back to the AAD App Registration page and navigate to 'Authentication' under the 'Manage' heading. Paste the redirect URI from step 10 under the 'Redirect URIs' and save.** 
12. **Return back to the private connector in Flow and proceed to the 'Definition' section. Toggle the 'Swagger Editor' switch and copy and paste the swagger YAML file from this repo.** 
13. **Save your changes by clicking 'Update connector'. Proceed to the 'Test' section. Select 'New connection' and login with your Microsoft account and test the endpoints.** 

The default connector definition from the swagger YAML file has two main operations: 

1. GetTemplate: Returns the template JSON given the version and templateId
2. RenderTemplate: Returns a data-bound card JSON given the version, templateId, and data JSON

![Microsoft Flow example](https://github.com/microsoft/adaptivecards-templates/blob/users/grzhan/flow/private-templates-service/flow/screenshots/flow.jpg?raw=true)
