import { ClientOptions } from "./IClientOptions";
import express, { Request, Response, NextFunction, Router } from "express";
import { check, validationResult } from "express-validator";
import { AuthenticationProvider } from "."; 
import { TemplateError, ApiError, ServiceErrorMessage } from "./models/errorModels";
import { StorageProvider } from ".";
import { ITemplate, JSONResponse, ITemplateInstance, IUser } from ".";

export class TemplateServiceClient {

    private storageProvider: StorageProvider;
    private authProvider: AuthenticationProvider;
    private ownerID: string | undefined;

    /**
     * @public
     * Initialize database if not already running
     * @param {ClientOptions} clientOptions - storage provider and auth provider options
     */
    public static init(clientOptions: ClientOptions): TemplateServiceClient {
        // TODO: add db setup step once mongo adapter is added

        if (clientOptions.storageProvider === undefined) {
            const error = new Error();
            error.name = "Missing Storage Provider";
            error.message = "Please provide a storage provider.";
            throw error;
        }

        if (clientOptions.authenticationProvider === undefined) {
            const error = new Error();
            error.name = "Missing Authentication Provider";
            error.message = "Please provide an authentication provider";
            throw error;
        }

        return new TemplateServiceClient(clientOptions.storageProvider, clientOptions.authenticationProvider);
    }
    
    /**
     * @private
     * Check if user has already been authenticated.
     */
    private _checkAuthenticated(): JSONResponse<any> {
      let owner = this.authProvider.getOwner();
      if (!owner){
          return { success: false, errorMessage: ServiceErrorMessage.AuthFailureResponse };
      }
      return { success: true }
    }

    /**
     * @public
     * Deletes user info - can only delete own user and all templates created by that user
     */
    public async removeUser(): Promise<JSONResponse<Number>> {
        let checkAuthentication = this._checkAuthenticated();
        if (!checkAuthentication.success) {
          return checkAuthentication;
        }

        if (!this.ownerID) return { success: true };
        
        // Remove all templates under user 
        const template : ITemplate = {
            instances: [],
            tags: [],
            owner: this.ownerID,
        }

        let deleteTemplateResponse = await this.storageProvider.removeTemplate(template);

        const user : IUser = {
            authId: this.authProvider.getOwner()!,
            issuer: this.authProvider.issuer,
        }

        let removeUserResponse = await this.storageProvider.removeUser(user);
        if (removeUserResponse.success) {
            this.ownerID = undefined;
        }

        if (!deleteTemplateResponse.success || !removeUserResponse.success) {
            return { success: false, errorMessage: ServiceErrorMessage.DeleteUserInfoFailed };
        }

        return removeUserResponse;
    }

    /**
     * @private
     * Get own user info.
     * Will return success if user does not exist but query is successful.
     */
    private async _getUser(): Promise<JSONResponse<IUser[]>> {
        let checkAuthentication = this._checkAuthenticated();
        if (!checkAuthentication.success) {
          return checkAuthentication;
        }

        const user: IUser = {
            authId: this.authProvider.getOwner()!,
            issuer: this.authProvider.issuer
        }

        return this.storageProvider.getUser(user);
    }

    /**
     * @private
     * @param {string} team - user's team within org
     * @param {string} org - user's organization
     */
    private async _postUser(team?: string, org?: string): Promise<JSONResponse<string>> {
        let checkAuthentication = this._checkAuthenticated();
        if (!checkAuthentication.success) {
          return checkAuthentication;
        }

        const user: IUser = {
            authId: this.authProvider.getOwner()!,
            issuer: this.authProvider.issuer,
            team: team? [team] : [],
            org: org? [org] : []
        }

        let response = await this.storageProvider.insertUser(user);
        if (response.success){
            this.ownerID = response.result;
        }
        return response;
    }

    /**
     * @private
     * Helper function to check if user exists and create a new user if not.
     */
    private async _createUser() : Promise<JSONResponse<string>> {
        // Check if user exists, if not, create new user
        let userResponse = await this._getUser();
        if (!userResponse.success || userResponse.result && userResponse.result.length === 0) {
            let newUser = await this._postUser();
            if (!newUser.success || !newUser.result) {
                return { success: false, errorMessage: ServiceErrorMessage.InvalidUser };
            }
        } else if (userResponse.success && userResponse.result && userResponse.result[0].id) {
            this.ownerID = userResponse.result[0].id;
        } else {
            return { success: false, errorMessage: ServiceErrorMessage.InvalidUser };
        }
        return { success: true };
    }

    /**
     * @private
     * Updates existing template, assumes that owner user exists/has already been created.
     * @param templateId - template id to update
     * @param template - updated template json
     * @param version - updated version number
     */
    private async _updateTemplate(templateId: string, template?: JSON, version?: string, isPublished?: boolean) : Promise<JSONResponse<Number>> {

        const queryTemplate: ITemplate = {
            id: templateId,
            instances: [],
            tags: []
        }

        const templateInstance: ITemplateInstance = {
            json: JSON.stringify(template),
            version: version || "1.0"
        }

        const newTemplate: ITemplate = {
            instances: [templateInstance],
            tags: [],
            owner: this.ownerID!,
            isPublished: isPublished
        }

        return this.storageProvider.updateTemplate(queryTemplate, newTemplate);
    }

    /**
     * @public
     * Post templates and checks if user exists
     * @param {JSON} template 
     * @param {string} templateId - unique template id
     * @param {string} version - version number
     * @returns Promise as valid json 
     */
    public async postTemplates(template: JSON, templateId?: string, version?: string, isPublished?: boolean): Promise<JSONResponse<string>> {
        let checkAuthentication = this._checkAuthenticated();
        if (!checkAuthentication.success) {
          return checkAuthentication;
        }

        if (!this.ownerID) {
            let response = await this._createUser();
            if (!response.success) return response;
        }

        // Check if template already exists
        let existingTemplate = await this.getTemplates(templateId);
        if (existingTemplate.success && existingTemplate.result && existingTemplate.result.length > 0 && templateId) {
            let updatedTemplate = await this._updateTemplate(templateId, template, version);
            if (updatedTemplate.success) {
                return { success: true };
            }
            return { success: false, errorMessage: ServiceErrorMessage.InvalidTemplate };
        }

        const templateInstance: ITemplateInstance = {
            json: JSON.stringify(template),
            version: version || "1.0" 
        }

        const newTemplate: ITemplate = {
            instances: [templateInstance],
            tags: [],
            owner: this.ownerID!,
            isPublished: isPublished
        }

        return this.storageProvider.insertTemplate(newTemplate);
    }

    /**
     * @public
     * Get entry point. 
     * Returns specified templates
     * @param {string} templateId - unique template id
     * @param {boolean} isPublished 
     * @param {string} templateName - name to query for
     * @param {string} version - version number
     * @param {boolean} owned - If false, will retrieve all public templates regardless of owner
     * @returns Promise as valid json 
     */
    public async getTemplates(templateId?: string, isPublished?: boolean, templateName?: string, version?: number, owned?: boolean): Promise<JSONResponse<ITemplate[]>> {
        let checkAuthentication = this._checkAuthenticated();
        if (!checkAuthentication.success) {
          return checkAuthentication;
        }

        if (owned) {
            if (!this.ownerID) {
                let response = await this._createUser();
                if (!response.success) return { success: false, errorMessage: ServiceErrorMessage.InvalidUser };
            }

            const templateQuery: ITemplate = {
                id : templateId,
                instances: [],
                tags: [],
                owner: this.ownerID,
                isPublished: isPublished,
            }
    
            return this.storageProvider.getTemplate(templateQuery);  
        }
      
        // Return all published public templates
        const templateQueryPublished: ITemplate = {
            id : templateId, 
            instances: [],
            tags: [],
            isPublished: isPublished
        }

        return this.storageProvider.getTemplate(templateQueryPublished);  
    }

    /**
     * @private
     * Async function for authenticating users before running endpoint code.
     */
    private _routerAuthentication = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.headers.authorization) {
            const err = new TemplateError(ApiError.InvalidAuthenticationToken, "Missing credentials.");
            return res.status(401).json({ error: err });
        }

        let valid = await this.authProvider.isValid(req.headers.authorization);

        if (!valid){
            const err = new TemplateError(ApiError.InvalidAuthenticationToken, "Token given is not a valid access token issued by Azure Active Directory.");
            return res.status(401).json({ error: err });
        }
        next();
    };

    /**
     * @public 
     * Sets up endpoints for template service api. 
     * Use as app.use("/template", TemplateServiceClient.expressMiddleware())
     * @returns express router 
     */
    public expressMiddleware(): Router {
        var router = express.Router();

        // Verify signature of access token before requests.
        router.all("/", this._routerAuthentication);

        router.get("/", (req: Request, res: Response, _next: NextFunction) => {
            if (req.params.name) {
                return res.status(501);
            }

            this.getTemplates(undefined, req.query.isPublished, req.query.name, req.query.version, req.query.owned).then(
                (response) => {
                    if (!response.success) {
                        const err = new TemplateError(ApiError.TemplateNotFound, "Unable to find any templates.");
                        return res.status(404).json({ error: err });
                    } 
                    res.status(200).json({ "templates": response.result });
                })
        })
        
        router.get("/:id?", (req: Request, res: Response, _next: NextFunction) => {
            this.getTemplates(req.params.id).then(
                (response) => {
                    if (!response.success || response.result && response.result.length === 0 ) {
                        const err = new TemplateError(ApiError.TemplateNotFound, `Template with id ${req.params.id} does not exist.`);
                        return res.status(404).json({ error: err });
                    }
                    res.status(200).json({ "templates": response.result });
                }
            )
        })

        router.post("/:id*?", async (req: Request, res: Response, _next: NextFunction) => {
            await check("template", "Template is not valid JSON.").isJSON().run(req);
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                const err = new TemplateError(ApiError.InvalidTemplate, "Template is incorrectly formatted.");
                return res.status(400).json({ error: err });
            }

            let response = req.params.id?
                await this.postTemplates(req.body.template, req.params.id) : 
                await this.postTemplates(req.body.template);

            if (!response.success){
                const err = new TemplateError(ApiError.InvalidTemplate, "Unable to create given template.");
                return res.status(400).json({ error: err })
            }
            
            return res.status(201).json({ "id" : response.result });
        })

        return router;
    }


    /**
     * @public
     * Sets up endpoints for template service users api.
     * Use as app.use("/user", TemplateServiceClient.userExpressMiddleware())
     * @returns express router
     */
    public userExpressMiddleware() : Router {
        var router = express.Router();

        // Verify signature of access token before requests.
        router.all("/", this._routerAuthentication);

        router.get("/", (_req: Request, res: Response, _next: NextFunction) => {
            this._getUser().then(
                (response) => {
                    if (!response.success) {
                        const err = new TemplateError(ApiError.UserNotFound, "Unable to find user information.");
                        return res.status(404).json({ error: err });
                    } 
                    res.status(200).json({ "user": response.result });
                })
        })

        router.delete("/", (_req: Request, res: Response, _next: NextFunction) => {
            this.removeUser().then(
                (response) => {
                    if (!response.success){
                        const err = new TemplateError(ApiError.DeleteUserInfoFailed, "Failed to delete user.");
                        return res.status(500).json({ error: err });
                    }
                    res.status(204).send();
                }
            )
        })

        return router;
    }

    private constructor(storageProvider: StorageProvider, authProvider: AuthenticationProvider) {
        this.storageProvider = storageProvider;
        this.authProvider = authProvider;
    }

}
