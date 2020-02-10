import express from "express";
import path from "path";
import passport from "./config/passport";
import bodyParser from "body-parser";
// import controllers
import { TemplateServiceClient } from "../../adaptivecards-templating-service/src/TemplateServiceClient";
import { ClientOptions } from "../../adaptivecards-templating-service/src/IClientOptions";
import { AzureADProvider } from "../../adaptivecards-templating-service/src/authproviders/AzureADProvider";
import { InMemoryDBProvider } from "../../adaptivecards-templating-service/src/storageproviders/InMemoryDBProvider";

const app = express();

// Express configuration
var cors = require("cors");
app.use(cors());
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const clientOptions: ClientOptions = {
	authenticationProvider: new AzureADProvider(),
	storageProvider: new InMemoryDBProvider()
};

const client: TemplateServiceClient = TemplateServiceClient.init(clientOptions);
app.use("/template", client.expressMiddleware());

app.get("/api/status", (req, res) => {
	res.status(200).send("Hello World");
});

export default app;
