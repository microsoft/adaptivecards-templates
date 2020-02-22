import { ClientOptions } from "./IClientOptions";
import express, { Request, Response, NextFunction, Router } from "express";
import { check, validationResult } from "express-validator";
import { AuthenticationProvider } from ".";
import { TemplateError, ApiError, ServiceErrorMessage } from "./models/errorModels";
import { StorageProvider } from ".";
import { ITemplate, JSONResponse, ITemplateInstance, IUser } from ".";
import { SortBy, SortOrder, TemplatePreview, TemplateState, TemplateInstancePreview, UserPreview, TagList } from "./models/models";
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

    // Remove all unpublished templates under user
    const template: Partial<ITemplate> = {
      owner: this.ownerID,
      isLive: false
    };

    let deleteTemplateResponse = await this.storageProvider.removeTemplate(template);

    const user: IUser = {
      authId: this.authProvider.getOwner()!,
      authIssuer: this.authProvider.issuer
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
   * Public update user info function. 
   * @param {string} firstName
   * @param {string}lastName
   * @param {string[]} team
   * @param {string[]} org
   */
  public async updateUser(firstName?: string, lastName?: string, team?: string[], org?: string[]): Promise<JSONResponse<Number>> {
    return this._updateUser(firstName, lastName, team, org);
  }

  /**
   * @private
   * Update user info and recently viewed.
   * @param {string} firstName
   * @param {string} lastName
   * @param {string[]} team
   * @param {string[]} org
   * @param {string[]} recentlyViewed - list of template ids last viewed by the logged in user, should be of length 5 or less
   */
  private async _updateUser(firstName?: string, lastName?: string, team?: string[], org?: string[], recentlyViewed?: string[]): Promise<JSONResponse<Number>> {
    let checkAuthentication = this._checkAuthenticated();
    if (!checkAuthentication.success) {
      return checkAuthentication;
    }

    const userQuery: Partial<IUser> = {
      authId: this.authProvider.getOwner()!,
      authIssuer: this.authProvider.issuer, 
    }

    const user : Partial<IUser> = {
      firstName: firstName, 
      lastName: lastName, 
      team: team,
      org: org,
      recentlyViewedTemplates: recentlyViewed
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
      authIssuer: this.authProvider.issuer
    };

    return this.storageProvider.getUsers(user);
  }

  /**
   * @private
   * Get other user's public info: {firstName, lastName, team, org}
   * Used by the template preview. 
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
   * Creates new user object, updates instance ownerID if successful.
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
      authIssuer: this.authProvider.issuer,
      firstName: firstName,
      lastName: lastName,
      team: team,
      org: org,
      recentlyViewedTemplates: recentlyViewed
    };

    let response = await this.storageProvider.insertUser(user);
    if (response.success && response.result) {
      this.ownerID = response.result;
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
      let newUser = await this._postUser([], [], undefined, undefined, []);
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
   * Increment the number of hits on a template.
   * @param templateId
   * @param template
   * @param version - If provided, only specific version numHits is incremented
   */
  private async _incrementTemplateHits(
    templateId: string, 
    template: ITemplate,
    version?: string): Promise<JSONResponse<Number>> {
    const queryTemplate: Partial<ITemplate> = {
      _id: templateId,
    };

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
   * Returns either all published or unpublished templates
   * @param template 
   * @param isPublished
   */
  private _getPublishedTemplates(template: ITemplate, isPublished: boolean): ITemplate {
    if (!template.instances || template.instances.length === 0) return template;
    let templateInstances: ITemplateInstance[] = [];
    for (let instance of template.instances){
      if ((isPublished && instance.state === TemplateState.live) || (!isPublished && instance.state !== TemplateState.live)){
        templateInstances.push(instance);
      }
    }
    template.instances = templateInstances;
    return template;
  }

  /**
   * @private 
   * Returns either all templates owned by the user, or all templates not owned by the user.
   * @param template 
   * @param owned 
   */
  private _getOwnedTemplates(templates: ITemplate[], owned: boolean): ITemplate[] {
    let result: ITemplate[] = [];
    for (let instance of templates){
      let isOwner = instance.owner === this.ownerID;
      if (isOwner && owned || !isOwner && !owned){
        result.push(instance);
      }
    }
    return result;
  }
  
  /**
   * @private
   * Updates existing template, assumes that owner user exists/has already been created.
   * Will check that the templateId given actually exists. 
   * @param {string} templateId - template id to update
   * @param {string} name 
   * @param {JSON} template - updated template json
   * @param {string} version - updated version number
   * @param {boolean} isPublished - if this field is set, the state will be "live" regardless of what the state input is
   * @param {TemplateState} state - "live" | "deprecated" | "draft"
   * @param {boolean} isShareable
   * @param {string} tag - append this tag onto existing tags array 
   * @param {string[]} tagList - replace existing tags with tagList
   * @param {JSON} data - append this json onto existing data array
   * @param {JSON[]} dataList - replace existing data list
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

    let existingTemplate: ITemplate = response.result[0];
    let templateName: string = name ? name : existingTemplate.name;
    let existingTags = existingTemplate.tags;
    if (tag){
      existingTags!.push(tag);
    }
    let tags: string[] | undefined = tag? existingTags : tagList;
    let templateState: TemplateState | undefined = isPublished? TemplateState.live : state;

    let templateInstance: ITemplateInstance = {
      json: JSON.stringify(template),
      version: version || "1.0", 
      state: templateState,
      data: [], 
      publishedAt: isPublished? new Date(Date.now()) : undefined,
      updatedAt: new Date(Date.now()),
      numHits: 0,
      isShareable: isShareable
    }

    let templateInstances: ITemplateInstance[] = [];
    if (existingTemplate.instances) {
      // Check if updated version already exists
      let added = false;
      for (let instance of existingTemplate.instances){
        if (instance.version === templateInstance.version) {
          let existingData = instance.data;
          if (data){
            existingData!.push(JSON.stringify(data));
          }
          let templateData: string[] | undefined = data? existingData: dataList? stringifyJSONArray(dataList) : undefined;
          templateInstance.numHits = instance.numHits;
          templateInstance.state = isPublished === false && templateInstance.state !== TemplateState.deprecated && templateInstance.state !== TemplateState.draft &&
                                  instance.state !== TemplateState.deprecated && instance.state !== TemplateState.draft? TemplateState.draft : 
                                  templateInstance.state || instance.state;
          templateInstance.data = templateData || instance.data;
          templateInstance.publishedAt = templateInstance.publishedAt || instance.publishedAt;
          templateInstance.isShareable = templateInstance.isShareable || instance.isShareable;
          added = true;
          templateInstances.push(templateInstance);
        } else {
          templateInstances.push(instance);
        }
      }
      if (!added) {
        let templateData: string[] | undefined = data? [JSON.stringify(data)]: dataList? stringifyJSONArray(dataList) : undefined;
        // Updated version does not already exist, add to instances list
        templateInstance.state = templateState || TemplateState.draft;
        templateInstance.isShareable = isShareable || false;
        templateInstance.data = templateData || [];
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
      isLive: existingTemplate.isLive || isPublished,
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
        dataItem = undefined;
      } else {
        dataItem = data;
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
      state: isPublished? TemplateState.live : state? state : TemplateState.draft,
      isShareable: isShareable || false,
      numHits: 0,
      data: data? data instanceof Array? stringifyJSONArray(data) : [JSON.stringify(data)] : [],
      updatedAt: new Date(Date.now())
    };

    let templateName = name || "Untitled Template";

    const newTemplate: ITemplate = {
      name: templateName,
      owner: this.ownerID!,
      instances: [templateInstance],
      tags: tags? tags instanceof Array? tags : [tags]: [],
      deletedVersions: [],
      isLive: isPublished || false,
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
   * @param {boolean} isClient - used to ignore updating the hit number on a template
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
    isClient?: boolean,
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
      owner: owned? this.ownerID : undefined
    };

    let response = await this.storageProvider.getTemplates(templateQuery, sortBy, sortOrder);

    if (!response.success || !response.result ) return response;

    let templates: ITemplate[] = response.result;

    if (owned === false) {
      templates = this._getOwnedTemplates(templates, owned);
    }
    
    if (isPublished || isPublished === false) {
      let templatesFiltered = [];
      for (let template of templates){
        let templateInstance = this._getPublishedTemplates(template, isPublished);
        if (template.instances && template.instances.length > 0) {
          templatesFiltered.push(templateInstance);
        }
      }
      templates = templatesFiltered;
    }

    if (templateId && templates.length > 0) {
      // Update recently viewed for user
      let user = await this._getUser();
      if (user.success && user.result && user.result.length === 1){
        let recentlyViewed = user.result[0].recentlyViewedTemplates;
        if (recentlyViewed!.includes(templateId)){
          let index = recentlyViewed!.indexOf(templateId);
          recentlyViewed!.splice(index, 1);
        }
        if (recentlyViewed!.length >= 5) {
          recentlyViewed!.shift();
        }
        recentlyViewed!.push(templateId);
        await this._updateUser(undefined, undefined, undefined, undefined, recentlyViewed);
      }

      if (!isClient) {
        // Update hit counter for template
        this._incrementTemplateHits(templateId, templates![0], version);
      }

      if (!version) return { success: true, result: templates };
    }

    // Filter for the latest template version (instance)
    let resultTemplates : ITemplate[] = [];
    for (let template of templates) {
      if (!template.instances) continue;
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
   * @param {string} templateId
   * @param {string} version 
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

    if (template.owner !== this.ownerID || template.isLive) {
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
      template.deletedVersions?.push(version);
      templateObj = template;
    }

    // No instances, delete template object entirely
    if (templateObj.instances && templateObj.instances.length === 0) {
      return this.storageProvider.removeTemplate({_id: templateId});
    }

    const query: Partial<ITemplate> = {
      _id: templateId
    }

    return this.storageProvider.updateTemplate(query, templateObj);
  }

  /**
   * @public
   * Retrieve preview of shareable template version.
   * @param {string} templateId
   * @param {string} version
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
    if (!templateVersion || templateVersion.isShareable === false) {
      return { success: false, errorMessage: ServiceErrorMessage.FailedToRetrievePreview };
    }

    let templateInstance: TemplateInstancePreview = {
      version: version, 
      json: JSON.parse(templateVersion.json),
      state: templateVersion.state || TemplateState.draft,
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
   * Retrieve a list of recently viewed templates for the logged in user.
   */
  public async getRecentTemplates(): Promise<JSONResponse<ITemplate[]>> {
    let checkAuthentication = this._checkAuthenticated();
    if (!checkAuthentication.success) {
      return checkAuthentication;
    }

    let results: ITemplate[] = [];
    let response = await this._getUser();
    if (!response.success || response.result && response.result.length === 0) {
      return { success: false, errorMessage: response.errorMessage };
    }

    let user: IUser = response.result![0];
    if (!user.recentlyViewedTemplates) {
      return { success: true, result: results };
    }

    for (let templateId of user.recentlyViewedTemplates) {
      let templateResponse = await this.getTemplates(templateId);
      if (templateResponse.success && templateResponse.result && templateResponse.result.length === 1){
        results.push(templateResponse.result[0]);
      }
    }
    return { success: true, result: results };
  }

  /**
   * @public
   * Get a list of tags available for logged in user to query by
   */
  public async getTags(): Promise<JSONResponse<TagList>> {
    let checkAuthentication = this._checkAuthenticated();
    if (!checkAuthentication.success) {
      return checkAuthentication;
    }

    let allTags = new Set();
    let ownedTags = new Set();
    let response = await this.getTemplates();
    if (!response.success || !response.result) return { success: false, errorMessage: response.errorMessage };
    for (let template of response.result) {
      if (!template.tags) continue;
      if (template.owner === this.ownerID) {
        for (let tag of template.tags){
          ownedTags.add(tag);
        }
      }
      if (template.isLive){
        for (let tag of template.tags){
          allTags.add(tag);
        }
      }
    }

    let list: TagList = {
      ownedTags: Array.from(ownedTags),
      allTags: Array.from(allTags)
    }
    return { success: true, result: list};
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

      let isPublished: boolean | undefined = req.query.isPublished? req.query.isPublished === "true" || req.query.isPublished === "True": undefined;
      let owned: boolean | undefined = req.query.owned? req.query.owned === "true" || req.query.owned === "True": undefined;
      let isClient: boolean = req.body.isClient;
      if (!req.is('application/json')) {
        isClient = req.body.isClient === "true" || req.body.isClient === "True";
      }

      this.getTemplates(undefined, isPublished, req.query.name, req.query.version, 
        owned, req.query.sortBy, req.query.sortOrder, req.body.tags, isClient).then(response => {
        if (!response.success) {
          return res.status(200).json({ templates: [] });
        }
        res.status(200).json({ templates: response.result });
      });
    });

    router.get("/recent", (_req: Request, res: Response, _next: NextFunction) => {
      this.getRecentTemplates().then(response => {
        if (!response.success) {
          return res.status(200).json({ templates: [] });
        }
        res.status(200).json({ templates: response.result });
      })
    });

    router.get("/tag", (_req: Request, res: Response, _next: NextFunction) => {
      this.getTags().then(response => {
        if (!response.success){
          return res.status(400).send();
        }
        res.status(200).json(response.result);
      })
    });

    router.get("/:id?", (req: Request, res: Response, _next: NextFunction) => {
      let isClient: boolean = req.body.isClient;
      if (!req.is('application/json')) {
        isClient = req.body.isClient === "true" || req.body.isClient === "True";
      }

      this.getTemplates(req.params.id, undefined, undefined, req.query.version, undefined, undefined, undefined, undefined, isClient).then(response => {
        if (!response.success || (response.result && response.result.length === 0)) {
          const err = new TemplateError(ApiError.TemplateNotFound, `Template with id ${req.params.id} does not exist.`);
          return res.status(404).json({ error: err });
        }
        res.status(200).json({ templates: response.result });
      });
    });

    router.get("/:id/preview", (req: Request, res: Response, _next: NextFunction) => {
      this.getTemplatePreview(req.params.id, req.query.version).then(response => {
        if (!response.success) {
          const err = new TemplateError(ApiError.TemplateNotFound, `Template with id ${req.params.id} does not exist.`);
          return res.status(404).json({ error: err });
        }
        res.status(200).json({ template: response.result });
      })
    })

    router.post("/:id*?", async (req: Request, res: Response, _next: NextFunction) => {
      await check("template", "Template is not valid JSON.")
        .isJSON()
        .run(req);
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const err = new TemplateError(ApiError.InvalidTemplate, "Template is incorrectly formatted.");
        return res.status(400).json({ error: err });
      }

      let isPublished: boolean = req.body.isPublished;
      let isShareable: boolean = req.body.isShareable;
      if (!req.is('application/json')) {
        isPublished = req.body.isPublished === "true" || req.body.isPublished === "True";
        isShareable = req.body.isShareable === "true" || req.body.isShareable === "True";
      }
      
      let tags: string[] | string = req.body.tags;
      let data: JSON[] | JSON = req.body.data;

      let response = req.params.id ?
        await this.postTemplates(req.body.template, req.params.id, req.body.version, isPublished, req.body.name, req.body.state, isShareable, tags, data) :
        await this.postTemplates(req.body.template, undefined, req.body.version, isPublished, req.body.name, req.body.state, isShareable, tags, data);

      if (!response.success) {
        const err = new TemplateError(ApiError.InvalidTemplate, "Unable to create given template.");
        return res.status(400).json({ error: err });
      }

      return res.status(201).json({ id: response.result });
    });

    router.delete("/:id*?", (req: Request, res: Response, _next: NextFunction) => {
      this.deleteTemplate(req.params.id, req.query.version).then(response => {
        if (!response.success){
          const err = new TemplateError(ApiError.DeleteTemplateVersionFailed, `Failed to delete template ${req.params.id} version.`);
          return res.status(404).json({ error: err });
        }
        res.status(204).send();
      })
    })
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
