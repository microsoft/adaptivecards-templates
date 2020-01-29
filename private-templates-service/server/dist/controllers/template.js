"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("../config/passport"));
const express_1 = __importDefault(require("express"));
const Template_1 = require("../models/Template");
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../util/logger"));
const jws_1 = __importDefault(require("jws"));
const express_validator_1 = require("express-validator");
const templateRouter = express_1.default.Router();
templateRouter.all("/", passport_1.default.authenticate("oauth-bearer", {
    session: false
}), function (req, res, next) {
    next();
});
// GET templates route
const getTemplates = (_req, res, next) => {
    Template_1.Template.find((err, templates) => {
        if (err)
            return next(err);
        res.json(templates);
    });
};
const getTemplateById = (req, res, _next) => {
    const templateId = req.params.id;
    Template_1.Template.findById(templateId, (err, template) => {
        if (err)
            return res.status(404).send("Template does not exist.");
        res.json(template);
    });
};
// POST templates route
const postTemplates = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: add more checks to validate template
    yield express_validator_1.check("template", "Template is not valid JSON.")
        .isJSON()
        .run(req);
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        logger_1.default.error(errors);
        return res.status(400).json(errors);
    }
    // Retrieve bearer token & decode oid
    var bearer = req.get("Authorization");
    if (!bearer) {
        return res.status(400).send("No access token was found.");
    }
    bearer = bearer.split(/[ ]+/).pop();
    if (!bearer) {
        return res.status(400).send("Malformed access token.");
    }
    var decodedTokenOid = jws_1.default.decode(bearer).payload.oid;
    logger_1.default.info("Owner is: " + decodedTokenOid);
    const template = new Template_1.Template({
        _id: mongoose_1.default.Types.ObjectId(),
        template: req.body.template,
        owner: decodedTokenOid,
        isPublished: req.body.isPublished
    });
    template.save(function (err) {
        if (err) {
            return next(err);
        }
        res.status(201).json(template);
    });
});
templateRouter.get("/", getTemplates);
templateRouter.get("/:id", getTemplateById);
templateRouter.post("/", postTemplates);
exports.default = templateRouter;
//# sourceMappingURL=template.js.map