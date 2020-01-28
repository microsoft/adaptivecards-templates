import passport from '../config/passport';
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { Template } from '../models/Template';
import mongoose from 'mongoose';
import logger from '../util/logger';
import jws from 'jws';
import { check, validationResult } from 'express-validator';

const templateRouter = express.Router();

templateRouter.all('/', passport.authenticate('oauth-bearer', {
    session: false
    }), function(req: Request, res: Response, next: NextFunction){
    next();
});

// GET templates route
const getTemplates = (req: Request, res: Response, next: NextFunction) => {
    Template.find((err, templates) => {
        if (err) return next(err);
        res.json(templates);
    });
}

const getTemplateById = (req: Request, res: Response, next: NextFunction) => {
    const templateId = req.params.id;
    Template.findById(templateId, (err, template) => {
        if (err) return res.status(404).send('Template does not exist.');
        res.json(template);
    })
}

// POST templates route
const postTemplates = async(req: Request, res: Response, next: NextFunction) => {
    // TODO: add more checks to validate template
    await check('template', 'Template is not valid JSON.').isJSON().run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        logger.error(errors);
        return res.status(400).json(errors);
    }

    // Retrieve bearer token & decode oid
    var bearer = req.get('Authorization');
    if (!bearer) {
        return res.status(400).send('No access token was found.');
    }
    bearer = bearer.split(/[ ]+/).pop();
    if (!bearer) {
        return res.status(400).send('Malformatted access token.');
    }

    var decodedTokenOid = jws.decode(bearer).payload.oid;
    logger.info('Owner is: ' + decodedTokenOid);

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

templateRouter.get('/', getTemplates);
templateRouter.get('/:id', getTemplateById);
templateRouter.post('/', postTemplates);

export default templateRouter;