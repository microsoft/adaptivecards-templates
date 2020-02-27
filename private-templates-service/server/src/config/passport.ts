import passport from "passport";
import passportAD, { ITokenPayload, VerifyCallback } from "passport-azure-ad";
import config from "./config";
import logger from "../util/logger";

// Logging levels for passport
enum LoggingLevels {
  Info = "info",
  Warn = "warn",
  Error = "error"
}

var options = {
  identityMetadata: config.identityMetadata,
  clientID: config.clientID,
  validateIssuer: config.validateIssuer,
  issuer: undefined, // For tenant-specific endpoint, issuer from metadata is used by default
  passReqToCallback: false,
  isB2C: false,
  policyName: undefined,
  allowMultiAudiencesInToken: config.allowMultiAudiencesInToken,
  audience: config.clientID,
  loggingLevel: LoggingLevels.Info
};

var bearerStrategy = new passportAD.BearerStrategy(options, function(
  token: ITokenPayload,
  done: VerifyCallback
) {
  logger.info(token, "was the token retreived");
  if (!token.oid) done(new Error("oid is not found in token"));
  else {
    logger.info("owner: ", token.oid);
    done(null, token);
  }
});

passport.use(bearerStrategy);

export default passport;
