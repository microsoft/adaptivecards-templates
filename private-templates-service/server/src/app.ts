import express from "express";
import path from "path";
import passport from "./config/passport";
import bodyParser from "body-parser";

// import controllers
import { TemplateServiceClient } from "../../adaptivecards-templating-service/src/TemplateServiceClient";
import { ClientOptions } from "../../adaptivecards-templating-service/src/IClientOptions";
import { AzureADProvider } from "../../adaptivecards-templating-service/src/authproviders/AzureADProvider";
import { MongoDBProvider } from "../../adaptivecards-templating-service/src/storageproviders/MongoDBProvider";
import { MongoConnectionParams } from "../../adaptivecards-templating-service/src/models/mongo/MongoConnectionParams";
// import mongo, create new mongo, pass options
const app = express();

// Express configuration
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoConnection: MongoConnectionParams = {
  connectionString: "#{DBConnection}#"
}

const mongoClient: ClientOptions = {
  authenticationProvider: new AzureADProvider(),
  storageProvider: new MongoDBProvider(mongoConnection),
}

const client: TemplateServiceClient = TemplateServiceClient.init(mongoClient);
app.use("/template", client.expressMiddleware());
app.use("/user", client.userExpressMiddleware());

app.get('/api/status', (req, res) => {
  res.status(200).send("Hello World");
})

export default app;
