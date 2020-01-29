import bunyan from "bunyan";

// Logger
var logger = bunyan.createLogger({
  name: "Adaptive Cards Admin Portal"
});

export default logger;
