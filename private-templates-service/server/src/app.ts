import express from "express";
import path from "path";
import passport from "./config/passport";
import bodyParser from "body-parser";

// import controllers
import { TemplateServiceClient } from "../../adaptivecards-templating-service/src/TemplateServiceClient";
import { ClientOptions } from "../../adaptivecards-templating-service/src/IClientOptions";
import { AzureADProvider } from "../../adaptivecards-templating-service/src/authproviders/AzureADProvider";
import { MongoDBProvider } from "../../adaptivecards-templating-service/src/storageproviders/MongoDBProvider";
// import mongo, create new mongo, pass options
const app = express();

// Express configuration
app.use(express.static(path.join(__dirname, "../../../../client/build")));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let mongoDB = new MongoDBProvider({ connectionString: "#{secrets.DB_CONNECTION_TOKEN}#" });
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
      } else {
        console.log(res.errorMessage);
      }

    }
  )

export default app;
