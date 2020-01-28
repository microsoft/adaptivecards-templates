import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import passport from './config/passport';

// import controllers
import templateRouter from './controllers/template';

const app = express();

// connect to temp mongoDB

// Express configuration
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(passport.initialize());
app.use(passport.session());

// Add routers 
app.use("/template", templateRouter);

export default app;
