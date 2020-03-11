import express from "express";
import path from "path";
import passport from "./config/passport";
import bodyParser from "body-parser";

// import controllers
import { TemplateServiceClient } from "../../adaptivecards-templating-service/src/TemplateServiceClient";
import { ClientOptions } from "../../adaptivecards-templating-service/src/IClientOptions";
import { AzureADProvider } from "../../adaptivecards-templating-service/src/authproviders/AzureADProvider";
import { MongoDBProvider } from "../../adaptivecards-templating-service/src/storageproviders/MongoDBProvider";

const RELATIVE_PATH_CLIENT = '../../../../client/build';

// import mongo, create new mongo, pass options
const app = express();

// Express configuration
app.use(express.static(path.join(__dirname, RELATIVE_PATH_CLIENT)));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
let mongoDB = new MongoDBProvider();
mongoDB.connect()
  .then(
    (res) => {
      if (res.success) {
        const mongoClient: ClientOptions = {
          authenticationProvider: new AzureADProvider(),
          storageProvider: mongoDB,
        }

        const client: TemplateServiceClient = TemplateServiceClient.init(mongoClient);
        app.use("/template", client.expressMiddleware());
        app.use("/user", client.userExpressMiddleware());

        // Keep this request at the end so it has lowest priority
        app.get('*', (req, res) => {
          res.sendFile(path.join(__dirname, RELATIVE_PATH_CLIENT + '/index.html'));
        })
      } else {
        console.log(res.errorMessage);
      }

    }
  )

export default app;
