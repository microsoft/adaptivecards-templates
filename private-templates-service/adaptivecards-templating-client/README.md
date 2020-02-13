## adaptivecards-templating-client

### Creating a client SDK 

Install Java and Maven following the installation steps [here](https://github.com/swagger-api/swagger-codegen#prerequisites).

Under `adaptivecards-templating-client`, run 

```shell
java -jar swagger-codegen-cli.jar generate \
	-i swagger.yaml
	-l <client sdk language>
	-o <client sdk language>
```

###  Typescript SDK Compilation
Creating a typescript client SDK requires additional parameters, see the following code for an example command. 

```shell
java -jar swagger-codegen-cli.jar generate -i swagger.yaml -l typescript-node -o typescript --additional-properties ngVersion=4.3,npmName=adaptive-templating-service-typescript-node,npmVersion=1.0.0
```

Under `typescript`, run `npm install`, then `npm run build`.

#### Typescript Troubleshooting
If you get the error: `Namespace 'http' has no exported member 'ClientResponse'`, refer to this [github issue](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/29674). 

### Making changes to the SDK definition file

Copy the existing `swagger.yaml` to [editor.swagger.io](https://editor.swagger.io/) to test new changes. 

### Running local server/API

Change host in `swagger.yaml` under `adaptivecards-templating-client` to `localhost:5000`.

In `app.ts` under `server`, add the below code to edit the endpoints to enable CORS. 

```javascript
app.use(function(req, res, next) {
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
