import mongoose from "mongoose";
import { Template as mTemplate } from "./models/Template" 
import { ClientOptions } from "./IClientOptions";
import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

export class TemplateServiceClient {

    //private provider : StorageProvider;
    private static owner : string = "";

    private static async run() : Promise<void> {
        // TODO: move db initialization to a separate class once adapter done
        const url = "mongodb://localhost:27017/test";
        mongoose.connect(url);
    }

    /**
     * @public
     * Initialize database if not already running, authenticate owner
     * @param {ClientOptions} clientOptions - storage provider and auth provider options
     */
    public static async init(clientOptions : ClientOptions) : Promise<TemplateServiceClient> {
        // Initialize db / check if initialized and documents are valid
        // Check storage provider is valid
        // if (options.storageProvider === undefined) {
        //     const error = new Error();
        //     error.name = "Invalid Storage Provider";
        //     error.message = "Please provide a storage provider.";
        //     throw error;
        // }
        await this.run()

        if (clientOptions.authenticationProvider === undefined) {
            const error = new Error();
            error.name = "Missing Authentication Provider";
            error.message = "Please provide an authentication provider";
            throw error;
        }

        TemplateServiceClient.owner = clientOptions.authenticationProvider.getOwner();

        // Authenticate
        return new TemplateServiceClient();
    }

    public portal() {
        // Returns react frontend
    }

    public async publishTemplate(templateId : string) : Promise<any> {
        // post with isPublished to true
    }

    /**
     * @public
     * Post templates
     * @returns Promise as valid json 
     */
    public async postTemplates(template: string) : Promise<any> {
        if (!TemplateServiceClient.owner){
            return new Error("No owner specified, please authenticate.");
        }
        return await mTemplate.create({
            _id: mongoose.Types.ObjectId(),
            template: template,
            owner: TemplateServiceClient.owner,
            isPublished: false,
        });
    }

    /**
     * @public
     * Get entry point. 
     * @returns Promise as valid json 
     */
    public async getTemplates(templateId?: string, templateName?: string) : Promise<any> {
        // Generate query from passed params
        // provider.getTemplate(query);
        if (templateId) {
            await mTemplate.findById(templateId, (err, template) => {
                if (err || !template) return new Error("No template with such id.");
                return template;
            });
        } else {
            return await mTemplate.find();
        }
    }

    /**
     * @public 
     * Sets up endpoints for template service api. 
     * Use as app.use("/template", TemplateServiceClient.expressMiddleware())
     * @returns express router 
     */
    public expressMiddleware() : Function {
        var router = express.Router();
        router.get("/", (req : Request, res : Response, next : NextFunction) => {
            if (req.params.name) {
                this.getTemplates(undefined, req.params.name).then(
                    (templates) => {
                        res.json(templates);
                        next();
                    }
                )
            }

            this.getTemplates().then(
                (templates) => {
                    res.json(templates); 
                    next();
                })
        })

        router.get("/:id", (req : Request, res : Response, next : NextFunction) => {
            this.getTemplates(req.params.id).then(
                (template) => {
                    if (!template) return res.status(404).send("Template does not exist.");
                    res.json(template);
                    next();
                }
            )
        })

        router.post("/", async (req : Request, res : Response, next: NextFunction) => {
            await check("template", "Template is not valid JSON.").isJSON().run(req);
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json(errors);
            }

            this.postTemplates(req.body.template).then(
                (template) => {
                    res.status(201).json(template);
                    next();
                }
            ).catch(() => {
                res.status(400).send("Failed to create template.");
            });
        })
        return router;
    }

    private constructor() {}
}

export * from "./authproviders/IAuthenticationProvider";
export * from "./authproviders/AzureADProvider";