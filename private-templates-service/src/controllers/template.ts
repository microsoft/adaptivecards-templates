import passport from '../config/passport';
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { Template } from '../models/Template';
import mongoose from 'mongoose';
import logger from '../util/logger';
import jws from 'jws';

const templateRouter = express.Router();

templateRouter.all('/', passport.authenticate('oauth-bearer', {
    session: false
    }), function(req: Request, res: Response, next: NextFunction){
    next();
});

const postTemplates = async(req: Request, res: Response, next: NextFunction) => {
    // do all checks here
    var token = req.body.token || req.query.token || req.headers['x-access-token']
    if (!token){
        var bearer = req.get('Authorization');
        if (bearer){
            token = bearer.split(/[ ]+/).pop();
        }
    }
    var decodedTokenOid = jws.decode(token).payload.oid;
    logger.info("owner is: " + decodedTokenOid);

    const template = new Template({
        _id: mongoose.Types.ObjectId(),
        template: req.body.template,
        owner: decodedTokenOid,
        isPublished: req.body.isPublished,
    })

    template.save( function(err) {
        if (err) {
            return next(err);
        }
        res.status(201).json(template);
    })
}

templateRouter.post('/', postTemplates);

// create a GET route
const getTemplates = (req: Request, res: Response, next: NextFunction) => {
    Template.find({}).exec((err, templates) => {
        if (err) return next(err);
        res.json(templates);
    });
}

templateRouter.get('/', getTemplates);

export default templateRouter;