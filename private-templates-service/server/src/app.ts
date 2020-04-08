let appInsights = require('applicationinsights');
appInsights.setup('InstrumentationKey=' + process.env.ACMS_APP_INSIGHTS_INSTRUMENTATION_KEY).start();

import express from "express";
import path from "path";
import passport from "./config/passport";
import bodyParser from "body-parser";
import session from "express-session";
import helmet from "helmet";

// import controllers
import { TemplateServiceClient } from "../../adaptivecards-templating-service/src/TemplateServiceClient";
import { ClientOptions } from "../../adaptivecards-templating-service/src/IClientOptions";
import { AzureADProvider } from "../../adaptivecards-templating-service/src/authproviders/AzureADProvider";
import { MongoDBProvider } from "../../adaptivecards-templating-service/src/storageproviders/MongoDBProvider";

const RELATIVE_PATH_CLIENT = '../../../../client/build';

// import mongo, create new mongo, pass options
const app = express();

// Express configuration
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet.hsts({
  maxAge: 15552000
}));
app.use(session({
  secret: process.env.ACMS_APP_ID || "ACMS",
  cookie: {
    httpOnly: true,
    secure: true
  },
  resave: false,
  saveUninitialized: true
}));
app.use(function (req, res, next) { res.header("Access-Control-Allow-Origin", "*"); res.header( "Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization, api_key" ); res.header( "Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE" ); next(); });

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
        app.use(express.static(path.join(__dirname, RELATIVE_PATH_CLIENT)));
        app.get('*', (req, res) => {
          res.header("Strict-Transport-Security", "max-age=15552000");
          res.sendFile(path.join(__dirname, RELATIVE_PATH_CLIENT + '/index.html'));
        })
      } else {
        console.log(res.errorMessage);
      }

    }
  )

export default app;
