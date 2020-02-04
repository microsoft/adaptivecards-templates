import express from "express";
import path from "path";
import passport from "./config/passport";
import bodyParser from "body-parser";

// import controllers
import { TemplateServiceClient, ClientOptions, AzureADProvider, AuthenticationProvider } from 'adaptivecards-templating-service';

const app = express();

// Express configuration
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(passport.initialize());
app.use(passport.session());
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
