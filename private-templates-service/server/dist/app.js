"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("./config/passport"));
const body_parser_1 = __importDefault(require("body-parser"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const express_session_1 = __importDefault(require("express-session"));
const bluebird_1 = __importDefault(require("bluebird"));
const logger_1 = __importDefault(require("./util/logger"));
// import controllers
const template_1 = __importDefault(require("./controllers/template"));
const app = express_1.default();
// connect to temp mongoDB (will be replaced by adapter)
const MongoStore = connect_mongo_1.default(express_session_1.default);
mongoose_1.default.Promise = bluebird_1.default;
// TODO: Move connection parameters to config once adapter is set up
mongoose_1.default
    .connect("mongodb://localhost/card", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
    .then(() => { })
    .catch(err => {
    logger_1.default.error("Mongodb connection error " + err);
});
// Express configuration
app.use(express_1.default.static(path_1.default.join(__dirname, "../client/build")));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_session_1.default({
    resave: true,
    saveUninitialized: true,
    secret: "test",
    store: new MongoStore({
        url: "mongodb://localhost/adaptivecard",
        autoReconnect: true
    })
}));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Add routers
app.use("/template", template_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map