import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import passport from './config/passport';
import bodyParser from 'body-parser';
import mongo from 'connect-mongo';
import session from 'express-session';
import bluebird from 'bluebird';

// import controllers
import templateRouter from './controllers/template';
import logger from './util/logger';

const app = express();

// connect to temp mongoDB
const MongoStore = mongo(session);
mongoose.Promise = bluebird;

mongoose.connect('mongodb://localhost/card',{
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useUnifiedTopology: true
}).then(
    () => {},
).catch(err => {
    logger.error("Mongodb connection error " + err);
});

// Express configuration
app.use(express.static(path.join(__dirname, "./client/build")));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "secret",
    store: new MongoStore({
        url: 'mongodb://localhost/card',
        autoReconnect: true
    })
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// Add routers 
app.use("/template", templateRouter);

export default app;