let appInsights = require('applicationinsights');
if (process.env.ACMS_APP_INSIGHTS_INSTRUMENTATION_KEY) appInsights.setup('InstrumentationKey=' + process.env.ACMS_APP_INSIGHTS_INSTRUMENTATION_KEY).start();
if (process.env.USER_APP_INSIGHTS_INSTRUMENTATION_KEY) appInsights.setup('InstrumentationKey=' + process.env.USER_APP_INSIGHTS_INSTRUMENTATION_KEY).start();


import express from "express";
import path from "path";
import passport from "./config/passport";
import bodyParser from "body-parser";
import session from "express-session";
import helmet from "helmet";
import mongoose from "mongoose";

// import controllers
const ACMS = require('adaptivecards-templating-service');

const RELATIVE_PATH_CLIENT = '../../client/build';

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
app.use(helmet.noSniff());

// If running locally, add the code specified in README enabling CORS

mongoose.set('useFindAndModify', false)
let mongoDB = new ACMS.MongoDBProvider({ connectionString: process.env.ACMS_DB_CONNECTION });
mongoDB.connect()
  .then(
    (res: any) => {
      if (res.success) {
        const mongoClient = {
          authenticationProvider: new ACMS.AzureADProvider(),
          storageProvider: mongoDB,
        }

        const client = ACMS.TemplateServiceClient.init(mongoClient);
        app.use("/template", client.expressMiddleware());
        app.use("/user", client.userExpressMiddleware());
        app.use("/config", client.configExpressMiddleware());

        // Keep this request at the end so it has lowest priority
        app.use(express.static(path.join(__dirname, RELATIVE_PATH_CLIENT)));
        app.get('*', (req, res) => {
          res.sendFile(path.join(__dirname, RELATIVE_PATH_CLIENT + '/index.html'));
        })
      } else {
        console.log(res.errorMessage);
      }

    }
  )

export default app;
