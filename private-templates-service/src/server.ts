import express from 'express';
import path from 'path';
import passport from 'passport';
import passportAD from 'passport-azure-ad';
import config from "./config";
import bunyan from 'bunyan';

enum LoggingLevels {
  Info = 'info',
  Warn = 'warn',
  Error = 'error'
}

let options = {
  identityMetadata: config.identityMetadata,
  clientID: config.clientID,
  validateIssuer: config.validateIssuer,
  issuer: undefined,                                    // For tenant-specific endpoint, issuer from metadata is used by default
  passReqToCallback: false,
  isB2C: false,
  policyName: undefined,
  allowMultiAudiencesInToken: config.allowMultiAudiencesInToken,
  audience: config.clientID,
  loggingLevel: LoggingLevels.Info
};

// Logger
var log = bunyan.createLogger({
  name: 'Adaptive Cards Admin Portal'
});

const app = express();
app.use(express.static(path.join(__dirname, "./client/build")));

// enables client side routing
// see https://create-react-app.dev/docs/deployment/#serving-apps-with-client-side-routing
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build", "index.html"));
});

const port = process.env.PORT || 5000;

app.use(passport.initialize());
app.use(passport.session());

var OIDCBearerStrategy = passportAD.BearerStrategy;
var bearerStrategy = new OIDCBearerStrategy(options,
  function (token: any, done: Function) {
    log.info(token, 'was the token retreived');
    if (!token.oid)
      done(new Error('oid is not found in token'));
    else {
      log.info('owner: ', token.oid);
      done(null, token);
    }
  }
);

passport.use(bearerStrategy);

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get("/express_backend", passport.authenticate('oauth-bearer', {
  session: false
}), (req, res) => {
  res.send({
    express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT. CONFIRMED"
  });
});
