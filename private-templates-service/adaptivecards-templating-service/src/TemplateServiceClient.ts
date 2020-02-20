import { ClientOptions } from "./IClientOptions";
import express, { Request, Response, NextFunction, Router } from "express";
import { check, validationResult } from "express-validator";
import { AuthenticationProvider } from ".";
import { TemplateError, ApiError, ServiceErrorMessage } from "./models/errorModels";
import { StorageProvider } from ".";
import { ITemplate, JSONResponse, ITemplateInstance, IUser } from ".";
import { SortBy, SortOrder, TemplatePreview, TemplateState, TemplateInstancePreview, UserPreview } from "./models/models";
import { getMostRecentTemplate, stringifyJSONArray, removeMostRecentTemplate, getTemplateVersion, JSONStringArray } from "./util/templateutils";

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
   * @public
   * @async
   * Connect to TemplateServiceClient's storage provider
   */
  public async connect() {
    return this.storageProvider.connect();
  }

  /**
   * @private
   * Check if user has already been authenticated.
   */
  private _checkAuthenticated(): JSONResponse<any> {
    let owner = this.authProvider.getOwner();
    if (!owner) {
      return {
        success: false,
        errorMessage: ServiceErrorMessage.AuthFailureResponse
      };
    }
    return { success: true };
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
    const template: Partial<ITemplate> = {
      owner: this.ownerID,
      isLive: false
    };

    let deleteTemplateResponse = await this.storageProvider.removeTemplate(template);

    const user: IUser = {
      authId: this.authProvider.getOwner()!,
      issuer: this.authProvider.issuer
    };

    let removeUserResponse = await this.storageProvider.removeUser(user);
    if (removeUserResponse.success) {
      this.ownerID = undefined;
    }

    if (!deleteTemplateResponse.success || !removeUserResponse.success) {
      return {
        success: false,
        errorMessage: ServiceErrorMessage.DeleteUserInfoFailed
      };
    }

    return removeUserResponse;
  }

  /**
   * @public 
   * Public update user info. 
   * @param firstName 
   * @param lastName 
   * @param team 
   * @param org 
   */
  public async updateUser(firstName?: string, lastName?: string, team?: string[], org?: string[]): Promise<JSONResponse<Number>> {
    return this._updateUser(firstName, lastName, team, org);
  }

  /**
   * @private
   * Update user info and recently viewed.
   */
  private async _updateUser(firstName?: string, lastName?: string, team?: string[], org?: string[], recentlyViewed?: string[]): Promise<JSONResponse<Number>> {
    let checkAuthentication = this._checkAuthenticated();
    if (!checkAuthentication.success) {
      return checkAuthentication;
    }

    const userQuery: Partial<IUser> = {
      authId: this.authProvider.getOwner()!,
      issuer: this.authProvider.issuer, 
    }

    const user : Partial<IUser> = {
      firstName: firstName, 
      lastName: lastName, 
      team: team,
      org: org,
      recentlyViewed: recentlyViewed
    }

    return this.storageProvider.updateUser(userQuery, user);
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
    };

    return this.storageProvider.getUsers(user);
  }

  /**
   * @private
   * Get other user's public info.
   */
  private async _searchUserInfo(id: string): Promise<JSONResponse<UserPreview>> {
    const query: Partial<IUser> = {
      _id: id
    };

    let response = await this.storageProvider.getUsers(query);
    if (!response.success || response.result && response.result.length === 0){
      return { success: false, errorMessage: ServiceErrorMessage.UserNotFound };
    }

    let user = response.result![0];
    const userInfo: UserPreview = {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      team: user.team,
      org: user.org
    }

    return { success: true, result: userInfo };
  }
  
  /**
   * @private
   * @param {string[]} team - user's team within org
   * @param {string[]} org - user's organization
   * @param {string} firstName 
   * @param {string} lastName
   * @param {string[]} recentlyViewed - list of ids of 
   */
  private async _postUser(
    team?: string[], 
    org?: string[], 
    firstName?: string, 
    lastName?: string, 
    recentlyViewed?: string[]): Promise<JSONResponse<string>> {
    let checkAuthentication = this._checkAuthenticated();
    if (!checkAuthentication.success) {
      return checkAuthentication;
    }

    const user: IUser = {
      authId: this.authProvider.getOwner()!,
      issuer: this.authProvider.issuer,
      firstName: firstName,
      lastName: lastName,
      team: team,
      org: org,
      recentlyViewed: recentlyViewed
    };

    let response = await this.storageProvider.insertUser(user);
    if (response.success) {
      this.ownerID = response.result!;
    }
    return response;
  }

  /**
   * @private
   * Helper function to check if user exists and create a new user if not.
   */
  private async _createUser(): Promise<JSONResponse<string>> {
    // Check if user exists, if not, create new user
    let userResponse = await this._getUser();
    if (!userResponse.success || (userResponse.result && userResponse.result.length === 0)) {
      let newUser = await this._postUser();
      if (!newUser.success || !newUser.result) {
        return {
          success: false,
          errorMessage: ServiceErrorMessage.InvalidUser
        };
      }
    } else if (userResponse.success && userResponse.result && userResponse.result[0]._id) {
      this.ownerID = userResponse.result[0]._id;
    } else {
      return {
        success: false,
        errorMessage: ServiceErrorMessage.InvalidUser
      };
    }
    return { success: true };
  }

  /**
   * @private
   * Increment number of hits
   * @param templateId
   * @param version - If provided, only specific version numHits is incremented
   */
  private async _incrementTemplateHits(
    templateId: string, 
    version?: string): Promise<JSONResponse<Number>> {
    const queryTemplate: Partial<ITemplate> = {
      _id: templateId,
    };

    let response = await this.getTemplates(templateId);
    if (!response.success || !response.result || response.result.length !== 1) {
      return { success: false };
    }
    let template = response.result[0];
    if (!template.instances) { 
      return { success: true };
    }
    let templateInstances = [];

    for (let instance of template.instances) {
      if (!version || version === instance.version) {
        instance.numHits! += 1;
      }
      templateInstances.push(instance);
    }

    const updatedTemplate: Partial<ITemplate> = {
      instances: templateInstances
    };

    return this.storageProvider.updateTemplate(queryTemplate, updatedTemplate);
  }
  /**
   * @private
   * Updates existing template, assumes that owner user exists/has already been created.
   * Will check that the templateId given actually exists. 
   * @param templateId - template id to update
   * @param template - updated template json
   * @param version - updated version number
   */
  private async _updateTemplate(
    templateId: string, 
    name?: string, 
    template?: JSON, 
    version?: string, 
    isPublished?: boolean, 
    state?: TemplateState, 
    isShareable?: boolean, 
    tag?: string,
    tagList?: string[],
    data?: JSON, 
    dataList?: JSON[]): Promise<JSONResponse<Number>> {
    const queryTemplate: Partial<ITemplate> = {
      _id: templateId,
    };

    // Check if version already exists
    let response = await this.getTemplates(templateId);
    if (!response.success || !response.result || response.result.length === 0) {
      return { success: false };
    }

    let existingTemplate : ITemplate = response.result[0];
    let templateName = name ? name : existingTemplate.name;
    let tags = tag? [tag] : tagList;
    let templateData : string[] | undefined = data? [JSON.stringify(data)] : dataList? stringifyJSONArray(dataList) : undefined;
    let templateState : TemplateState | undefined = isPublished? TemplateState.live : state;

    let templateInstance: ITemplateInstance = {
      json: JSON.stringify(template),
      version: version || "1.0", 
      state: templateState,
      data: templateData, 
      publishedAt: isPublished? new Date(Date.now()) : undefined,
      updatedAt: new Date(Date.now()),
      numHits: 0,
      isShareable: isShareable
    }

    let templateInstances : ITemplateInstance[] = [];
    if (existingTemplate.instances) {
      let added = false;
      for (let instance of existingTemplate.instances){
        if (instance.version === version) {
          templateInstance.numHits = instance.numHits;
          added = true;
          templateInstances.push(templateInstance);
        } else {
          templateInstances.push(instance);
        }
      }
      if (!added) {
        templateInstances.push(templateInstance);
      }
    } else {
      templateInstances.push(templateInstance);
    }

    const newTemplate: Partial<ITemplate> = {
      name: templateName,
      instances: templateInstances,
      tags: tags,
      owner: this.ownerID!,
      updatedAt: new Date(Date.now()),
      isLive: isPublished,
    };

    return this.storageProvider.updateTemplate(queryTemplate, newTemplate);
  }

  /**
   * @public
   * Post templates and checks if user exists
   * @param {JSON} template
   * @param {string} templateId - unique template id
   * @param {string} version - version number
   * @param {boolean} isPublished - if template is live
   * @param {string} name - template name
   * @param {TemplateState} state - draft || deprecated || live
   * @param {boolean} isShareable 
   * @param {string[]} tags
   * @param {JSON[]} data - sample data to be bound with template - templateID must be defined 
   * @returns Promise as valid json
   */
  public async postTemplates(
    template: JSON, 
    templateId?: string, 
    version?: string, 
    isPublished?: boolean, 
    name?: string, 
    state?: TemplateState, 
    isShareable?: boolean, 
    tags?: string[] | string, 
    data?: JSON[] | JSON): Promise<JSONResponse<String>> {
    let checkAuthentication = this._checkAuthenticated();
    if (!checkAuthentication.success) {
      return checkAuthentication;
    }

    if (!this.ownerID) {
      let response = await this._createUser();
      if (!response.success) return response;
    }

    // Updating existing template
    if (templateId) {
      let tagList : string[] | undefined;
      let tag : string | undefined;
      let dataList : JSON[] | undefined;
      let dataItem : JSON | undefined;

      if (tags instanceof Array) {
        tagList = tags;
        tag = undefined;
      } else {
        tagList = undefined;
        tag = tags;
      }
        
      if (data instanceof Array) {
        dataList = data;
        data = undefined;
      } else {
        data = data;
        dataList = undefined;
      }

      let response = await this._updateTemplate(templateId, name, template, version, isPublished, state, isShareable, tag, tagList, dataItem, dataList);

      if (response.success) {
        return { success: true };
      }
      return {
        success: false,
        errorMessage: ServiceErrorMessage.InvalidTemplate
      };
    }

    const templateInstance: ITemplateInstance = {
      json: JSON.stringify(template),
      version: version || "1.0",
      publishedAt: isPublished? new Date(Date.now()) : undefined,
      state: isPublished? TemplateState.live : state,
      isShareable: isShareable,
      numHits: 0,
      data: data instanceof Array? stringifyJSONArray(data) : [JSON.stringify(data)],
      updatedAt: new Date(Date.now())
    };

    let templateName = name || "Untitled Template";

    const newTemplate: ITemplate = {
      name: templateName,
      owner: this.ownerID!,
      instances: [templateInstance],
      tags: tags? tags instanceof Array? tags : [tags]: undefined,
      isLive: isPublished,
      updatedAt: new Date(Date.now()) 
    };

    return this.storageProvider.insertTemplate(newTemplate);
  }

  /**
   * @public
   * Get entry point.
   * Returns the latest version of all published (live) and owned templates.
   * @param {string} templateId - unique template id
   * @param {boolean} isPublished - search only for live templates
   * @param {string} templateName - name to query for
   * @param {string} version - version number, used with templateId
   * @param {boolean} owned - If false, will retrieve all public templates regardless of owner
   * @param {SortBy} sortBy - one of dateCreated, dateModified, alphabetical
   * @param {SortOrder} sortOrder - one of ascending, descending
   * @param {string[]} tags - filter by one or more tags
   * @returns Promise as valid json
   */
  public async getTemplates(
    templateId?: string,
    isPublished?: boolean,
    templateName?: string,
    version?: string,
    owned?: boolean,
    sortBy?: SortBy, 
    sortOrder?: SortOrder, 
    tags?: string[],
  ): Promise<JSONResponse<ITemplate[]>> {
    let checkAuthentication = this._checkAuthenticated();
    if (!checkAuthentication.success) {
      return checkAuthentication;
    }

    if (owned && !this.ownerID) {
      let response = await this._createUser();
      if (!response.success)
        return {
          success: false,
          errorMessage: ServiceErrorMessage.InvalidUser
        };
    }

    const templateQuery : Partial<ITemplate> = {
      _id: templateId,
      name: templateName,
      tags: tags,
      owner: owned? this.ownerID : undefined,
      isLive: isPublished
    };

    let response = await this.storageProvider.getTemplates(templateQuery, sortBy, sortOrder);

    if (templateId && response.success) {
      // Update recently viewed for user
      let user = await this._getUser();
      if (user.success && user.result && user.result.length === 1){
        let recentlyViewed = user.result[0].recentlyViewed;
        recentlyViewed!.shift();
        recentlyViewed!.push(templateId);
        await this._updateUser(undefined, undefined, undefined, undefined, recentlyViewed);
      }

      // Update hit counter for template
      this._incrementTemplateHits(templateId, version);
    }

    if (!response.success || templateId || !response.result) return response;

    // Filter for the latest template version (instance)
    let resultTemplates : ITemplate[] = [];
    for (let template of response.result) {
      if (!template.instances) continue; 
      // Get specific version
      if (version) {
        for (let instance of template.instances){
          if (version && instance.version === version) {
            template.instances = [instance];
            resultTemplates.push(template);
            break;
          }
        }
      } else {
        resultTemplates.push(getMostRecentTemplate(template));
      }
    }
    return { success: true, result: resultTemplates };
  }

  /**
   * @public
   * Delete template endpoint. 
   * If the only template version is deleted, the entire template object is deleted. 
   * If a version is not specified, the last version is deleted. 
   * @param templateId
   * @param version 
   */
  public async deleteTemplate(templateId: string, version?: string): Promise<JSONResponse<Number>> {
    let checkAuthentication = this._checkAuthenticated();
    if (!checkAuthentication.success) {
      return checkAuthentication;
    }

    // Get template instance, check owner and isPublished
    let response = await this.getTemplates(templateId);
    if (!response.success || !response.result ) {
      return { success: false, errorMessage: response.errorMessage };
    }
    if (response.result.length === 0) {
      return { success: true };
    }
    let template = response.result[0];

    if (template.owner != this.ownerID || template.isLive) {
      return { success: false, errorMessage: ServiceErrorMessage.UnauthorizedAction }
    }

    // No instances, delete template object entirely
    if (!template.instances) {
      return this.storageProvider.removeTemplate({_id: templateId});
    }

    let templateObj : ITemplate;
    if (!version) {
      templateObj = removeMostRecentTemplate(template);
    } else {
      let templateInstances = [];
      for (let instance of template.instances){
        if (instance.version !== version) {
          templateInstances.push(instance);
        }
      }
      template.instances = templateInstances;
      templateObj = template;
    }

    const query: Partial<ITemplate> = {
      _id: templateId
    }

    return this.storageProvider.updateTemplate(query, templateObj);
  }

  /**
   * @public
   * Retrieve preview of shareable template version.
   * @param templateId
   */
  public async getTemplatePreview(templateId: string, version: string): Promise<JSONResponse<TemplatePreview>> {
    const templateQuery: Partial<ITemplate> = {
      _id: templateId
    }

    let response = await this.storageProvider.getTemplates(templateQuery);
    if (!response.success || response.result && response.result.length === 0){
      return { success: false, errorMessage: ServiceErrorMessage.FailedToRetrievePreview };
    }

    let template = response.result![0];
    let templateVersion = getTemplateVersion(template, version);
    if (!templateVersion) {
      return { success: false, errorMessage: ServiceErrorMessage.FailedToRetrievePreview };
    }

    let templateInstance: TemplateInstancePreview = {
      version: version, 
      json: JSON.parse(templateVersion.json),
      state: templateVersion.state || "draft",
      data: templateVersion.data? JSONStringArray(templateVersion.data) : []
    }

    let userInfo = await this._searchUserInfo(template.owner);
    if (!userInfo.success || !userInfo.result) {
      return { success: false, errorMessage: ServiceErrorMessage.FailedToRetrievePreview };
    }

    let templatePreview : TemplatePreview = {
      _id: templateId, 
      name: template.name,
      owner: userInfo.result!,
      instance: templateInstance,
      tags: template.tags || [],
    }

    return { success: true, result: templatePreview };
  }

  /**
   * @public
   * Get a list of tags available for logged in user to query by
   */
  public async getTags(): Promise<JSONResponse<any[]>> {
    let checkAuthentication = this._checkAuthenticated();
    if (!checkAuthentication.success) {
      return checkAuthentication;
    }

    let tags = new Set();
    let response = await this.getTemplates();
    if (!response.success || !response.result) return { success: false, errorMessage: response.errorMessage };
    for (let template of response.result) {
      if (!template.tags) continue;
      for (let tag of template.tags){
        tags.add(tag);
      }
    }
    return { success: true, result: Array.from(tags)};
  }

  /**
   * @private
   * Async function for authenticating users before running endpoint code.
   */
  private _routerAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "OPTIONS") {
      next();
    }

    if (!req.headers.authorization) {
      const err = new TemplateError(ApiError.InvalidAuthenticationToken, "Missing credentials.");
      return res.status(401).json({ error: err });
    }

    let valid = await this.authProvider.isValid(req.headers.authorization);

    if (!valid) {
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
      if (req.query.sortBy && !(req.query.sortBy in SortBy)){
        const err = new TemplateError(ApiError.InvalidQueryParam, "Sort by value is not valid.");
        res.status(400).json({ error: err });
      }

      if (req.query.sortOrder && !(req.query.sortOrder in SortOrder)){
        const err = new TemplateError(ApiError.InvalidQueryParam, "Sort order value is not valid.");
        res.status(400).json({ error: err });
      }

      this.getTemplates(undefined, req.query.isPublished, req.query.name, req.query.version, 
        req.query.owned, req.query.sortBy, req.query.sortOrder, req.body.tags).then(response => {
        if (!response.success) {
          return res.status(200).json({ templates: [] });
        }
        res.status(200).json({ templates: response.result });
      });
    });

    router.get("/:id?", (req: Request, res: Response, _next: NextFunction) => {
      this.getTemplates(req.params.id).then(response => {
        if (!response.success || (response.result && response.result.length === 0)) {
          const err = new TemplateError(ApiError.TemplateNotFound, `Template with id ${req.params.id} does not exist.`);
          return res.status(404).json({ error: err });
        }
        res.status(200).json({ templates: response.result });
      });
    });

    router.post("/:id*?", async (req: Request, res: Response, _next: NextFunction) => {
      await check("template", "Template is not valid JSON.")
        .isJSON()
        .run(req);
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const err = new TemplateError(ApiError.InvalidTemplate, "Template is incorrectly formatted.");
        return res.status(400).json({ error: err });
      }

      let response = req.params.id ?
        await this.postTemplates(req.body.template, req.params.id, req.body.version, req.body.isPublished, req.body.name) :
        await this.postTemplates(req.body.template, undefined, req.body.version, req.body.isPublished, req.body.name);

      if (!response.success) {
        const err = new TemplateError(ApiError.InvalidTemplate, "Unable to create given template.");
        return res.status(400).json({ error: err });
      }

      return res.status(201).json({ id: response.result });
    });

    return router;
  }

  /**
   * @public
   * Sets up endpoints for template service users api.
   * Use as app.use("/user", TemplateServiceClient.userExpressMiddleware())
   * @returns express router
   */
  public userExpressMiddleware(): Router {
    var router = express.Router();

    // Verify signature of access token before requests.
    router.all("/", this._routerAuthentication);

    router.get("/", (_req: Request, res: Response, _next: NextFunction) => {
      this._getUser().then(response => {
        if (!response.success) {
          return res.status(200).json({ user: [] });
        }
        res.status(200).json({ user: response.result });
      });
    });

    router.post("/", (req: Request, res: Response, _next: NextFunction) => {
      this.updateUser(req.body.firstName, req.body.lastName, req.body.team, req.body.org).then(response => {
        if (!response.success){
          return res.status(400);
        }
        res.status(200).send();
      })
    });

    router.delete("/", (_req: Request, res: Response, _next: NextFunction) => {
      this.removeUser().then(response => {
        if (!response.success) {
          const err = new TemplateError(ApiError.DeleteUserInfoFailed, "Failed to delete user.");
          return res.status(500).json({ error: err });
        }
        res.status(204).send();
      });
    });

    return router;
  }

  private constructor(storageProvider: StorageProvider, authProvider: AuthenticationProvider) {
    this.storageProvider = storageProvider;
    this.authProvider = authProvider;
  }
}
