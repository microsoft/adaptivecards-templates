[![Deploy to Azure](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/deploybutton.png)](https://azuredeploy.net/)


| Branch | Build Status |
| ------ | ------------ |
|  dev   | [![Build Status](https://dev.azure.com/microsoft/AdaptiveCards/_apis/build/status/ACMS/Deploy%20to%20Web%20App?branchName=dev)](https://dev.azure.com/microsoft/AdaptiveCards/_build/latest?definitionId=50969&branchName=dev) |
|  stage | [![Build Status](https://dev.azure.com/microsoft/AdaptiveCards/_apis/build/status/ACMS/Deploy%20to%20Web%20App?branchName=stage)](https://dev.azure.com/microsoft/AdaptiveCards/_build/latest?definitionId=50969&branchName=stage) |

# Quickstart

## Deploy to Azure

Prerequisites: 

- Azure account
- Azure Active Directory (AAD) App Registration (instructions below)
- [Azure resource group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal)
- Azure App Service Plan
- Optional: [Azure Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)

1. Click the blue '**Deploy to Azure**'. Select the subscription and resource group under which you wish to deploy ACMS to. 
2. Enter in the URL the portal will be hosted at into the '**Sites_adaptivecms_name**' field. Make sure this URL is added under the '**Redirect URIs**' section of your AAD App Registration. Detailed instructions and screenshots are listed below. 
3. Enter in the Azure Active Directory App Registration application (client) id into the '**App_id**' field. 
4. Enter the id of your App Service Plan into the '**Server_farm_id**' field. 
5. If 'Yes' is selected for '**Telemetry_opt_in**', we will collect feedback from your instance of ACMS using App Insights. See details under 'Telemetry Privacy Statement' below. 
6. Optional: If you possess an Azure Application Insights instance, enter the instrumentation key into the '**application_insights_instrumentation_key**' field. 
To create an Application Insights resource or find your instrumentation key, please see [Create an Application Insights resource](https://docs.microsoft.com/en-us/azure/azure-monitor/app/create-new-resource). See details under 'Telemetry Privacy Statement' below.
7. Click '**Next**' and '**Deploy**'.

Using the 'Deploy to Azure' button will fetch an image using the latest published version of [adaptivecards-templating-service](https://www.npmjs.com/package/adaptivecards-templating-service) and [adaptive-templating-service-typescript-node](https://www.npmjs.com/package/adaptive-templating-service-typescript-node). Once the deployment as finished, you will see the admin portal hosted at '**{Sites_adaptivecms_name}**.azurewebsites.net' and be able to hit the endpoints at the same URL. 

### Creating a new AAD App Registration

1. Go to the [Azure Portal](portal.azure.com). 
2. In the searchbar, type 'Azure Active Directory' and select the AAD service. 
3. Select 'App Registrations' under the 'Manage' header. 
4. Click 'New registration'.
5. Fill in the details for a new AAD registration. Under 'Redirect URI', enter the URL at which the admin portal is hosted at from the 'Deploy to Azure' instructions. 
6. Click 'Register'. 

### Telemetry Privacy Statement

**Telemetry_opt_in**

If "**YES**" is selected in the **Telemetry_opt_in** step in the Deploy to Azure setup, Microsoft's Azure Application Insights instrumentation key will be exposed to the app as an environment variable. The app will then send its performance data to Microsoft's Azure Application Insights instance. The code gathering telemetry is located in the first lines in the `private-templates-service\server\src\app.ts` file and in the componentDidUpdate function of the `private-templates-service\client\src\App.tsx` file.

If "**NO**" is selected in the **Telemetry_opt_in** step in the Deploy to Azure setup, the instrumentation key will not be exposed as an environment variable and no performance data will be sent to Microsoft's Azure Application Insights instance.

By accepting the **Telemetry_opt_in**, you are improving the product by sending some of your performance data to Microsoft. By accepting the **Telemetry_opt_in**, you acknowledge your responsibility to provide a privacy statement to your end user.

**application_insights_instrumentation_key**

By supplying an instrumentation key in the **application_insights_instrumentation_key** field, you acknowledge your responsibility to provide a privacy statement to your end user.

## Running the latest changes locally with MongoDB

Prerequisites:

-   Git
-   [Node v12](https://nodejs.org/en/download/)
-   MongoDB 

1. Clone the repository.

2. Switch to the desired branch. The latest build is on `dev`.

3. Set the below environment variables to the desired values in the terminal being used to run the app. 

```
ACMS_DB_CONNECTION // Mongo database connection string
ACMS_APP_ID // Azre Active Directory App Registration Application (client) id 
ACMS_REDIRECT_URI // http://localhost:3000
```

4. Open `server/app.ts` and insert the following code at the comment. 

```
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept, Authorization, api_key"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, DELETE"
  );
  next();
});
```

5. `cd adaptivecards-templates/private-templates-service/server` and run `npm run init-app`. This installs and links dependencies.

6. In the same directory as step 5, run `npm run dev`. This command concurrently runs the client and server locally. Navigate to `localhost:3000` to see the site.

## Running the latest changes without MongoDB

Prerequisites:

-   Git
-   [Node v12](https://nodejs.org/en/download/)

1. Clone the repository.

2. Switch to the desired branch. The latest build is on `dev`.

3. Set the below environment variables to the desired values. 

```
ACMS_APP_ID // Azre Active Directory App Registration Application (client) id 
ACMS_REDIRECT_URI // http://localhost:3000
```

4. Open `server/app.ts` and insert the following code at the comment:
```
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept, Authorization, api_key"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, DELETE"
  );
  next();
});

```
5. Replace the MongoDBProvider with the InMemoryProvider in `server/app.ts`. 
```
const mongoClient = {
  authenticationProvider: new AMS.AzureADProvider(),
  storageProvider: new ACMS.InMemoryDBProvider(),
}
```
6. `cd adaptivecards-templates/private-templates-service/server` and run `npm run init-app`. This installs and links dependencies.

7. In the same directory as step 6, run `npm run dev`. This command concurrently runs the client and server locally. Navigate to `localhost:3000` to see the site.

   

# Nodejs download on WSL

1. To download compatable nodejs, npm

```
sudo apt-get autoremove --purge npm node nodejs
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```



# Linting and Code Convention Setup for VSCode

**1. Download the following extensions for VSCode:**

-   ESLint
-   Prettier - Code formatter
-   Babel ES6/ES7

The project is setup to contain a .vscode folder with all the setting configuration for these VSCode extension.

**2. To install all node modules needed for code formatting on save:**

```
npm install
```

At this point, ESLint and Prettier should work in conjuction to auto-format all files on save.
A restart of VScode may be required.

## Confirm Valid Setup

To confirm that you are setup correctly, open a js file in the repository and write the following:

```
const l = [1,2,3,
4,    5,
6];
```

Once you save the file, this line of code should be code formatted as below:

```
const l = [1, 2, 3, 4, 5, 6];
```

## Troubleshooting

Things to watch out for:

-   You **must** have auto-saving turned off on VSCode. Saving needs to be manually triggered.
-   Make sure you are accessing the repo by opening the repository folder in VSCode rather than particular files in the repository. To do so, in VSCode, go to File -> Open Folder and open the adaptivecards-templates folder.


