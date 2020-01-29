"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_azure_ad_1 = __importDefault(require("passport-azure-ad"));
const config_1 = __importDefault(require("./config"));
const logger_1 = __importDefault(require("../util/logger"));
// Logging levels for passport
var LoggingLevels;
(function (LoggingLevels) {
    LoggingLevels["Info"] = "info";
    LoggingLevels["Warn"] = "warn";
    LoggingLevels["Error"] = "error";
})(LoggingLevels || (LoggingLevels = {}));
var options = {
    identityMetadata: config_1.default.identityMetadata,
    clientID: config_1.default.clientID,
    validateIssuer: config_1.default.validateIssuer,
    issuer: undefined,
    passReqToCallback: false,
    isB2C: false,
    policyName: undefined,
    allowMultiAudiencesInToken: config_1.default.allowMultiAudiencesInToken,
    audience: config_1.default.clientID,
    loggingLevel: LoggingLevels.Info
};
var bearerStrategy = new passport_azure_ad_1.default.BearerStrategy(options, function (token, done) {
    logger_1.default.info(token, "was the token retreived");
    if (!token.oid)
        done(new Error("oid is not found in token"));
    else {
        logger_1.default.info("owner: ", token.oid);
        done(null, token);
    }
});
passport_1.default.use(bearerStrategy);
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map