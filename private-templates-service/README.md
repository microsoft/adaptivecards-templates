# Quickstart
These steps will get our end-to-end app running locally. If any steps fail, try the longer steps below.

Prerequisites:
-   Git
-   [Node v12](https://nodejs.org/en/download/)

**1. Clone the reponsitory.**

**2. Switch to the desired branch. The latest build is on `dev`**

**3. `cd adaptivecards-templates/private-templates-service/server` and run `npm run init-app`. This installs and links dependencies.**

**4. Open `server/app.ts` and replace mongoose code lines 39 - 64 with 
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

const mongoClient: ClientOptions = {
  authenticationProvider: new AzureADProvider(),
  storageProvider: new InMemoryDBProvider(),
}
const client: TemplateServiceClient = TemplateServiceClient.init(mongoClient);
app.use("/template", client.expressMiddleware());
app.use("/user", client.userExpressMiddleware());
```.**

**5. In the `adaptivecards-templates/private-templates-service/server/app.ts` file, replace ` "#{DB_CONNECTION_TOKEN}#"` with the real DB connection string. Make sure to NOT commit this file. Ask a dev for this string!**

**6. Run `npm run dev`. This command concurrently runs the client and server locally. Navigate to `localhost:3000` to see the site.**

# Running the frontend and backend of Adaptive Cards CMS Locally

To run this web application locally, you must have the following installed on your system:

-   Git
-   [Node v12](https://nodejs.org/en/download/)

**1. Clone the repository.**

**2. Switch to the appropriate branch.**

**3. In the `adaptivecards-templates/private-templates-service/server/app.ts` file, add the following:**
`
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
});`

**4. In the `adaptivecards-templates/private-templates-service/server/app.ts` file, replace ` "#{DB_CONNECTION_TOKEN}#"` with the real DB connection string. Make sure to NOT commit this file.**

**5. Under the `adaptivecards-templates/private-templates-service/server`, run `npm run link-client`. Please note you may have to remove the command `sudo` from `private-templates-service\server\package.json`.**

**6. Inside of `adaptivecards-templates/private-templates-service/server` run `npm install`, run `tsc`, and run `npm run dev` to launch the client and server in your default browser.**

**You're good to go!**

# Running the backend

To run this web application locally, you must have the following installed on your system:

-   Git
-   [Node v12](https://nodejs.org/en/download/)

**1. Clone the repository.**

**2. Switch to the appropriate branch.**

**3. In the `adaptivecards-templates/private-templates-service/server/app.ts` file, add the following:
`
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
`**

**4.  In the `adaptivecards-templates/private-templates-service/server/app.ts` file, replace ` "#{DB_CONNECTION_TOKEN}#"` with the real DB connection string. Make sure to not commit this file.**

**5. Under the `private-templates-service\adaptivecards-templating-service` directory, run `npm link`.**

**6. Under the `adaptivecards-templates/private-templates-service/server` directory, run `npm link adaptivecards-templating-service`, run `npm install`, run `tsc`, and run `npm run start`.**

**You're good to go!**

# Running the frontend

To run this web application locally, you must have the following installed on your system:

-   Git
-   [Node v12](https://nodejs.org/en/download/)

**1. Clone the repository.**

**2. Switch to the appropriate branch.**

**3. In the `private-templates-service\adaptivecards-templating-client\typescript\api.ts` file, replace `http://localhost:5000` (defaultBasePath) with `https://adaptivecms.azurewebsites.net`.**

**4.  Under the `private-templates-service\server` directory, run `npm run link-client`.**

**5. Under the `private-templates-service\client` directory, run `npm install` and `npm run start`.**

**You're good to go!**

## Development

**1. Run the command `npm install` in both the `server` and the `client` diretories.**
**2. Navigate to the `server` folder and run the follwing command `npm run link-client`. If you are getting an error about permission, run the command `sudo npm run link-client`.**
**3. Inside the `server` folder, run the command `npm run dev`. This will run both the frontend and the backend together. You may now navigate to `localhost:3000` in your browser.**

## Troubleshooting

-   When running `npm start`, confirm in your shell that the localhost port matches the port in the `Config.tsx` redirectUri. It should be port 3000 but it can be different.

# Nodejs download on WSL

1. To download compatable nodejs, npm

```
sudo apt-get autoremove --purge npm node nodejs
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```

# Running the Adaptive Cards Template Service API Locally

## Installation steps

Using the endpoints currently requires installing MongoDB locally. Download [MongoDB's Community Server](https://www.mongodb.com/download-center/community?jmp=nav).

Download [Postman](https://app.getpostman.com/app/download/win64) to test the endpoints.

#### Setting up your own app with Azure AD for testing

If you have a client secret for the app deployed at https://adaptivecms.azurewebsites.net/, ignore this step.

Login to Azure portal and go to Azure Active Directory. Click App registrations, and create a new registration. Under supported account types, select '_Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts_' and click Register.

Select the app you just registered and go to Authentication. Under Implicit Grant, enable both Access tokens and ID tokens. Under Certificates & secrets, add a new Client secret and record the value.

### Running the backend

Under `adaptivecards-templates/private-template-service/src/config/config.ts`, add the client ID of the Azure AD app under the clientID field.

Under `adaptivecards-templates/private-template-service` run `npm install`.

Run `npm start`.

### Using Postman to test endpoints

#### Obtaining an access token

Post a request to https://login.microsoftonline.com/{tenant_id}/oauth2/token using Postman.
In the body add keys grant_type, client_id, client_secret, and resource.

**grant_type**: client_credentials

**client_id**: {client id for app registered with Azure AD}

**client_secret**: {client secret for app registered with Azure AD}

**resource**: {client_id}

Post the request and copy the access_token field in the response.

#### Sending a request

Create a new request with Postman and select either GET or POST for `http://localhost:5000/template`. Under Headers, add the key 'Authorization' and add the value as 'Bearer {access_token}'.

Leaving out the Authorization header should return a 401 Unauthorized error.

### Get templates

This endpoint returns a list of all known templates.

> `HTTP GET https://localhost:5000/template`

**Response excerpt**

```json
[
	{
		"_id": "5e2f6de4c4a23957d4dfb4dc",
		"template": "{}",
		"isPublished": false,
		"created": "2020-01-27T23:10:28.564Z",
		"__v": 0
	}
]
```

This endpoint returns a template given the template id.

> `HTTP GET https://localhost:5000/template/{template_id}`

### Post a template

This endpoints creates a new template and returns 201 if successfully created.

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
