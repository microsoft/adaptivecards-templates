import bunyan from "bunyan";

// Logger
var logger = bunyan.createLogger({
  name: "TemplateServiceClient logger"
});

export default logger;
