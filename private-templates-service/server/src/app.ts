import express from "express";
import path from "path";
import mongoose from "mongoose";
import passport from "./config/passport";
import bodyParser from "body-parser";
import mongo from "connect-mongo";
import session from "express-session";
import bluebird from "bluebird";
import logger from "./util/logger";

// import controllers
import { TemplateServiceClient, ClientOptions, AzureADProvider, AuthenticationProvider } from 'adaptivecards-templating-service';

const app = express();

// connect to temp mongoDB (will be replaced by adapter)
const MongoStore = mongo(session);
mongoose.Promise = bluebird;

// TODO: Move connection parameters to config once adapter is set up
mongoose
  .connect("mongodb://localhost/card", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    server: {
      socketOptions: {
        connectTimeoutMS: 0,
      }
    }
  })
  .then(() => { })
  .catch(err => {
    logger.error("Mongodb connection error " + err);
  });

// Express configuration
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(passport.initialize());
app.use(passport.session());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "test",
    store: new MongoStore({
      url: "mongodb://localhost/adaptivecard",
      autoReconnect: true
    })
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const clientOptions : ClientOptions = {
    authenticationProvider: new AzureADProvider(),
}

TemplateServiceClient.init(clientOptions).then(
    (client : TemplateServiceClient) => {
        app.use("/template", client.expressMiddleware());
    }
)

app.get('/api/status', (req, res) => {
  res.status(200).send("Hello World");
})

export default app;
