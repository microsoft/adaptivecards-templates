### Installation and Usage
After we have installed the templating service package via:
`npm install adaptivecards-templating-service`

We can import storage and mongo providers:

```
import { StorageProvider, MongoDBProvider } from 'adaptivecards-templating-service';
```


#### Basic provider workflow
```
let db: StorageProvider = new MongoDBProvider({connectionString: "myConnectionString"});
```
Before running any queries we have to establish connection to the database and make sure that it was successfull:
```
await db.connect().then(response => {
	// Check result status of the connectiona attempt:
	if(!response.success) {
		// Handle unsuccessful connection attemp here:
		console.log(result.errorMessage);
		process.exit(1);
	}
});
```
Now we can run queries
Ex., to insert a user: (check for required data fields in src/models/models.ts)
```
await db.insertUser({authId: "j1valo2", issuer: "abra", team: ["cats", "dogs"]}).then(response => {
	if(response.success) {
	    console.log(response.result); // insertUser will return _id of a new inserted user
	}
});
```
Ex., to insert a template:
```
let templateID: string;
await db.insertTemplate({name: "weather template", instances: [{json:"key:value", version:"1.0."}]).then(response => {
	if(response.success) {
		templateID = response.result; // Save the id so we can use it later
	}
});
```
Ex., to retrieve a template:
```
await db.getTemplates({_id: templateID}).then(response => {
	if(response.success) {
		console.log(response.result);
	}
});
```
Ex., to sort the results of query
It will return all the templates that contain "sun" in their name in ascending order:
```
await db.getTemplates({name: "sun"}, SortBy.name, SortOrder.ascending).then(response => {
	if(response.success) {
		console.log(response.result);
	}
})
```
