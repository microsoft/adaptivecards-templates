# Quickstart

## Deploy to Azure

Prerequisites: 

- Azure account
- Azure Active Directory (AAD) App Registration (instructions below)
- [Azure resource group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal)
- Azure App Service Plan

1. Click the blue '**Deploy to Azure**'. Select the subscription and resource group under which you wish to deploy ACMS to. 
2. Enter in the URL the portal will be hosted at into the '**Sites_adaptivecms_name**' field. Make sure this URL is added under the '**Redirect URIs**' section of your AAD App Registration. Detailed instructions and screenshots are listed below. 
3. Enter in the Azure Active Directory App Registration application (client) id into the '**App_id**' field. 
4. Enter the id of your App Service Plan into the '**Server_farm_id**' field. 
5. If 'Yes' is selected for '**Telemetry_opt_in**', we will collect feedback from your instance of ACMS using App Insights. 
6. Click '**Next**' and '**Deploy**'.

Using the 'Deploy to Azure' button will fetch an image using the latest published version of [adaptivecards-templating-service](https://www.npmjs.com/package/adaptivecards-templating-service) and [adaptive-templating-service-typescript-node](https://www.npmjs.com/package/adaptive-templating-service-typescript-node). Once the deployment as finished, you will see the admin portal hosted at '**{Sites_adaptivecms_name}**.azurewebsites.net' and be able to hit the endpoints at the same URL. 

### Creating a new AAD App Registration

1. Go to the [Azure Portal](portal.azure.com). 
2. In the searchbar, type 'Azure Active Directory' and select the AAD service. 
3. Select 'App Registrations' under the 'Manage' header. 
4. Click 'New registration'.
5. Fill in the details for a new AAD registration. Under 'Redirect URI', enter the URL at which the admin portal is hosted at from the 'Deploy to Azure' instructions. 
6. Click 'Register'. 

## Running the latest changes locally with MongoDB

Prerequisites:

-   Git
-   [Node v12](https://nodejs.org/en/download/)
-   MongoDB 

1. Clone the repository.

2. Switch to the desired branch. The latest build is on `dev`.

3. Set the below environment variables to the desired values. 

```
ACMS_DB_CONNECTION // Mongo database connection string
ACMS_APP_ID // Azre Active Directory App Registration Application (client) id 
ACMS_REDIRECT_URI // http://localhost:3000
```

4. Open `server/app.ts` and insert the following code at line 38. 

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

6. Run `npm run dev`. This command concurrently runs the client and server locally. Navigate to `localhost:3000` to see the site.

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

**4. Open `server/app.ts` and replace lines 39 - 64 with the following:**

```
import { InMemoryDBProvider } from '../../adaptivecards-templating-service/src/storageproviders/InMemoryDBProvider';

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
app.options('*', function (req, res) { res.sendStatus(200); });

const options: ClientOptions = {
  authenticationProvider: new AzureADProvider(),
  storageProvider: new InMemoryDBProvider(),
}
const client: TemplateServiceClient = TemplateServiceClient.init(options);
app.use("/template", client.expressMiddleware());
app.use("/user", client.userExpressMiddleware());
```

5. `cd adaptivecards-templates/private-templates-service/server` and run `npm run init-app`. This installs and links dependencies.

6. Run `npm run dev`. This command concurrently runs the client and server locally. Navigate to `localhost:3000` to see the site.

   

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
