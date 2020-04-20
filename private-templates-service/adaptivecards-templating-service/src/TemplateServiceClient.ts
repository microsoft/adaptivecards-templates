import { ClientOptions } from "./IClientOptions";
import express, { Request, Response, NextFunction, Router } from "express";
import { AuthenticationProvider } from ".";
import { TemplateError, ApiError, ServiceErrorMessage } from "./models/errorModels";
import { StorageProvider } from ".";
import { ITemplate, JSONResponse, ITemplateInstance, IUser } from ".";
import { SortBy, SortOrder, TemplatePreview, TemplateState, TemplateInstancePreview, TagList, TemplateStateRequest } from "./models/models";
import { updateTemplateToLatestInstance, getTemplateVersion, isValidJSONString, setTemplateInstanceParam, incrementVersion, anyVersionsLive, sortTemplateByVersion, parseToken, getMostRecentVersion, checkValidTemplateState, incrementVersionStr, createCard } from "./util/templateutils";
import logger from "./util/logger"

export class TemplateServiceClient {
  private storageProvider: StorageProvider;
  private authProvider: AuthenticationProvider;

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
  private _checkAuthenticated(token?: string): JSONResponse<any> {
    let accessToken = token || this.authProvider.token;
    if (!this.authProvider.isValid(accessToken)) {
      return {
        success: false,
        errorMessage: ServiceErrorMessage.AuthFailureResponse
      };
    }
    return { success: true };
  }

  /**
   * Return user id from database.
   * @param authID 
   */
  private async _getUserID(authId: string): Promise<JSONResponse<string>> {
    let response = await this._getUser(authId);
    if (!response.success || (response.result && response.result.length === 0)) {
      return { success: false, errorMessage: ServiceErrorMessage.UserNotFound };
    }
    return { success: true, result: response.result![0]._id };
  }

  /**
   * @public
   * Deletes user info - can only delete own user and all templates created by that user
   */
  public async removeUser(token?: string): Promise<JSONResponse<Number>> {
    let authCheck = this._checkAuthenticated(token);
    if (!authCheck.success) {
      return authCheck;
    }

    let authId = this.authProvider.getAuthIDFromToken(token || this.authProvider.token);
    let userResponse = await this._getUserID(authId);
    if (!userResponse.success) {
      return { success: false, errorMessage: ServiceErrorMessage.UserNotFound };
    }

    const user: IUser = {
      authId: authId,
      authIssuer: this.authProvider.issuer
    };

    let removeUserResponse = await this.storageProvider.removeUser(user);

    if (!removeUserResponse.success) {
      return {
        success: false,
        errorMessage: ServiceErrorMessage.DeleteUserInfoFailed
      };
    }

    return removeUserResponse;
  }

  /**
   * @private
   * Update and recently viewed, edited, tags.
   * @param {string} authId
   * @param {string[]} recentlyViewed - list of template ids last viewed by the logged in user, should be of length 5 or less
   * @param {string[]} recentlyEdited - list of template ids last edited by the logged in user, should be of length 5 or less
   * @param {string[]} recentTags - list of tags last used by the logged in user, should be of length 10 or less
   */
  private async _updateUser(
    authId: string,
    recentlyViewed?: string[],
    recentlyEdited?: string[],
    recentTags?: string[],
    favoriteTags?: string[]
  ): Promise<JSONResponse<Number>> {

    const userQuery: Partial<IUser> = {
      authId: authId,
      authIssuer: this.authProvider.issuer
    };

    const user: Partial<IUser> = {
      recentlyViewedTemplates: recentlyViewed,
      recentlyEditedTemplates: recentlyEdited,
      recentTags: recentTags,
      favoriteTags: favoriteTags
    };

    return this.storageProvider.updateUser(userQuery, user);
  }

  public async updateFavoriteTags(favorite: string[], unfavorite: string[], token?: string): Promise<JSONResponse<Number>> {
    let authCheck = this._checkAuthenticated(token);
    if (!authCheck.success) {
      return authCheck;
    }

    let tagResponse = await this.getTags(token);
    if (!tagResponse.success || !tagResponse.result) {
      return { success: false, errorMessage: tagResponse.errorMessage };
    }
    let favoriteTags: string[] = tagResponse.result.favoriteTags || [];
    let allTags: string[] = tagResponse.result.allTags || [];
    for (let tag of favorite) {
      if (!favoriteTags.includes(tag) && allTags.includes(tag)) favoriteTags.push(tag);
    }
    for (let tag of unfavorite) {
      if (favoriteTags.includes(tag)) {
        let index = favoriteTags.indexOf(tag);
        favoriteTags.splice(index, 1);
      }
    }
    let authId = this.authProvider.getAuthIDFromToken(token || this.authProvider.token);
    return this._updateUser(authId, undefined, undefined, undefined, favoriteTags);
  }

  /**
   * @private
   * Get user's public info.
   * Used by the template preview.
   */
  private async _searchUserInfo(id: string): Promise<JSONResponse<string>> {
    const query: Partial<IUser> = {
      _id: id
    };

    let response = await this.storageProvider.getUsers(query);
    if (!response.success || (response.result && response.result.length === 0)) {
      return { success: false, errorMessage: ServiceErrorMessage.UserNotFound };
    }

    let user = response.result![0];

    return { success: true, result: user.authId };
  }

  /**
   * @private
   * Get own user info.
   * Will return success if user exists and is unique.
   * Creates a new user and returns user if user does not already exist. 
   */
  private async _getUser(authId: string): Promise<JSONResponse<IUser[]>> {
    const query: Partial<IUser> = {
      authId: authId,
      authIssuer: this.authProvider.issuer
    };

    let result = await this.storageProvider.getUsers(query);
    if (!result.success) {
      // User does not exist
      let createUserResponse = await this._postUser(authId);
      if (!createUserResponse.success) {
        return { success: false, errorMessage: createUserResponse.errorMessage };
      }
      result = await this.storageProvider.getUsers(query);
    }
    if (!result.success) {
      return { success: false, errorMessage: ServiceErrorMessage.UserNotFound }
    }
    logger.info(`User with oid ${authId} requested data.`);

    return result;
  }

  /**
   * @public
   * Get own user info. 
   * @param token 
   */
  public async getUser(token?: string): Promise<JSONResponse<IUser>> {
    let authCheck = this._checkAuthenticated(token || this.authProvider.token);
    if (!authCheck.success) {
      return authCheck;
    }

    let userResponse = await this._getUser(this.authProvider.getAuthIDFromToken(token || this.authProvider.token));
    if (userResponse.success) {
      return { success: true, result: userResponse.result![0] }
    }
    return { success: false, errorMessage: userResponse.errorMessage };
  }

  /**
   * @private
   * Creates new user object, updates instance authorID if successful.
   * @param {string[]} recentlyViewed - list of template ids last viewed by the logged in user, should be of length 5 or less
   * @param {string[]} recentlyEdited - list of template ids last edited by the logged in user, should be of length 5 or less
   * @param {string[]} recentTags - list of tags last used by the logged in user, should be of length 10 or less
   */
  private async _postUser(
    authId: string,
    recentlyViewed?: string[],
    recentlyEdited?: string[],
    recentTags?: string[],
    favoriteTags?: string[]
  ): Promise<JSONResponse<string>> {
    const user: IUser = {
      authId: authId,
      authIssuer: this.authProvider.issuer,
      recentlyViewedTemplates: recentlyViewed || [],
      recentlyEditedTemplates: recentlyEdited || [],
      recentTags: recentTags || [],
      favoriteTags: favoriteTags || [],
    };

    let newUser = await this.storageProvider.insertUser(user);
    if (!newUser.success) {
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
  private async _incrementTemplateHits(templateId: string, template: ITemplate, version?: string): Promise<JSONResponse<Number>> {
    const queryTemplate: Partial<ITemplate> = {
      _id: templateId
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
  private _getStateTemplates(template: ITemplate, state: TemplateState): ITemplate {
    if (!template.instances || template.instances.length === 0) return template;
    let templateInstances: ITemplateInstance[] = [];
    for (let instance of template.instances) {
      if (state === instance.state) {
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
  private async _getOwnedTemplates(authId: string, templates: ITemplate[], owned: boolean): Promise<ITemplate[]> {
    let user = await this._getUserID(authId);
    let result: ITemplate[] = [];
    if (!user.success) return result;

    for (let template of templates) {
      let isAuthor = template.authors.includes(user.result!);
      if ((isAuthor && owned) || (!isAuthor && !owned)) {
        result.push(template);
      }
    }
    return result;
  }

  /**
   * @private
   * Updates existing template, assumes that Author user exists/has already been created.
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
    dataList?: JSON[],
    token?: string
  ): Promise<JSONResponse<Number>> {
    const queryTemplate: Partial<ITemplate> = {
      _id: templateId
    };

    // Check if version already exists
    let response = await this.getTemplates(token, templateId, undefined, undefined, undefined, undefined, undefined, undefined, undefined, true);
    if (!response.success || !response.result || response.result.length === 0) {
      return { success: false };
    }

    let existingTemplate: ITemplate = response.result[0];
    let templateName: string = name ? name : existingTemplate.name;
    let existingTags = existingTemplate.tags;

    if (tag) {
      existingTags!.push(tag);
    }
    let tags: string[] | undefined = tag ? existingTags : tagList;
    let templateState: TemplateState | undefined = state;

    if (!version) {
      version = incrementVersion(existingTemplate);
    }
    let authId = this.authProvider.getAuthIDFromToken(token || this.authProvider.token);
    let userResponse = await this._getUserID(authId);
    if (!userResponse.success) return { success: false, errorMessage: userResponse.errorMessage };

    let templateInstance: ITemplateInstance = {
      json: template ? template : JSON.parse("{}"),
      version: version || "1.0",
      state: templateState,
      author: userResponse.result!,
      data: [],
      publishedAt: state === TemplateState.live ? new Date(Date.now()) : undefined,
      updatedAt: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      numHits: 0,
      isShareable: isShareable,
      lastEditedUser: authId
    };
    let templateInstances: ITemplateInstance[] = [];
    if (existingTemplate.instances) {
      // Check if updated version already exists
      let added = false;
      for (let instance of existingTemplate.instances) {
        if (instance.version === templateInstance.version) {
          let templateData: JSON[] | undefined = data ? [data] : dataList ? dataList : undefined;
          if (instance.state === TemplateState.deprecated || instance.state === TemplateState.live && templateState !== TemplateState.deprecated) {
            // The template that is trying to be modified is deprecated
            if (isShareable) instance.isShareable = isShareable;
            templateInstances.push(instance);
            // Pushing existing deprecated version back
            if (template || state) {
              version = incrementVersion(existingTemplate);
              if (instance.state === TemplateState.deprecated) templateState = templateState === TemplateState.live ? TemplateState.live : TemplateState.draft;
              templateInstance = setTemplateInstanceParam(templateInstance, templateData, templateState, isShareable, version, template ? template : instance.json);
              templateInstances.push(templateInstance);
            }
            added = true;
            continue;
          } else if (instance.state === TemplateState.live && templateState === TemplateState.deprecated) {
            // Set the template to deprecated
            templateInstance = setTemplateInstanceParam(templateInstance, templateData, templateState, isShareable, version, template ? template : instance.json);
            templateInstances.push(templateInstance);
            added = true;
            continue;
          }

          let existingData = instance.data;
          if (data) {
            existingData!.push(data);
          }
          templateData = data ? existingData : dataList ? dataList : undefined;
          templateInstance.numHits = instance.numHits;
          templateInstance.state = templateInstance.state !== TemplateState.deprecated && templateInstance.state !== TemplateState.draft &&
            instance.state !== TemplateState.draft ? TemplateState.draft :
            templateInstance.state || instance.state;
          templateInstance.author = instance.author; // author should not be able to be overwritten
          templateInstance.data = templateData || instance.data;
          templateInstance.publishedAt = templateInstance.publishedAt || instance.publishedAt;
          templateInstance.isShareable = templateInstance.isShareable || instance.isShareable;
          templateInstance.json = template ? template : instance.json;
          added = true;
          templateInstances.push(templateInstance);
        } else {
          templateInstances.push(instance);
        }
      }
      if (!added && template) {
        let templateData: JSON[] | undefined = data ? [data] : dataList ? dataList : undefined;
        // Updated version does not already exist, add to instances list
        templateState = templateState === TemplateState.live ? TemplateState.live : TemplateState.draft;
        templateInstance = setTemplateInstanceParam(templateInstance, templateData, templateState, isShareable, version)
        templateInstances.push(templateInstance);

      }
    } else {
      templateInstances.push(templateInstance);
    }

    // Re-create entire author array
    let authorsList: string[] = [];
    for (let instance of templateInstances) {
      if (!authorsList.includes(instance.author)) {
        authorsList.push(instance.author);
      }
    }

    const newTemplate: Partial<ITemplate> = {
      name: templateName,
      instances: templateInstances,
      tags: tags,
      authors: authorsList,
      updatedAt: new Date(Date.now()),
      isLive: anyVersionsLive(templateInstances)
    };

    return this.storageProvider.updateTemplate(queryTemplate, newTemplate);
  }

  /**
   * @public 
   * Batch update template state only, template must already exist. 
   * Can only publish & unpublish batch template versions. 
   */
  public async batchUpdateTemplate(templateId: string, requests: TemplateStateRequest[], token?: string): Promise<JSONResponse<Number>> {
    let authCheck = this._checkAuthenticated(token);
    if (!authCheck.success) {
      return authCheck;
    }

    let authId = this.authProvider.getAuthIDFromToken(token || this.authProvider.token);
    let userResponse = await this._getUser(authId);
    if (!userResponse.success || (userResponse.result && userResponse.result.length === 0)) {
      return { success: false, errorMessage: userResponse.errorMessage };
    }
    const userId = userResponse.result![0]._id;

    // Check if version already exists
    let response = await this.getTemplates(token, templateId, undefined, undefined, undefined, undefined, undefined, undefined, undefined, true);
    if (!response.success || !response.result || response.result.length === 0) {
      return { success: false, errorMessage: response.errorMessage };
    }

    let existingTemplate: ITemplate = response.result[0];
    let latestVersion: string = getMostRecentVersion(existingTemplate)?.version || "1.0";
    let templateInstances: ITemplateInstance[] = [];
    for (let instance of existingTemplate.instances || []) {
      for (let request of requests) {
        if (request.version === instance.version) {
          if (instance.state && checkValidTemplateState(instance.state, request.state)) {
            instance.state = request.state;
            instance.updatedAt = new Date(Date.now());
          }
          if (instance.state === TemplateState.deprecated && request.state === TemplateState.live) {
            const instanceCopy: ITemplateInstance = {
              json: instance.json,
              version: incrementVersionStr(latestVersion),
              publishedAt: new Date(Date.now()),
              state: TemplateState.live,
              author: userId!,
              isShareable: false,
              numHits: 0,
              data: instance.data,
              updatedAt: new Date(Date.now()),
              lastEditedUser: authId
            };
            latestVersion = instanceCopy.version;
            templateInstances.push(instanceCopy);
          }
          break;
        }
      }
      templateInstances.push(instance);
    }

    // Re-create entire author array
    let authorsList: string[] = [];
    for (let instance of templateInstances) {
      if (!authorsList.includes(instance.author)) {
        authorsList.push(instance.author);
      }
    }

    const updatedTemplate: Partial<ITemplate> = {
      instances: templateInstances,
      authors: authorsList,
    };
    return this.storageProvider.updateTemplate({ _id: templateId }, updatedTemplate);
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
    data?: JSON[] | JSON,
    token?: string,
    isDataBound?: boolean
  ): Promise<JSONResponse<String>> {
    let authCheck = this._checkAuthenticated(token);
    if (!authCheck.success) {
      return authCheck;
    }

    let authId = this.authProvider.getAuthIDFromToken(token || this.authProvider.token);
    let userResponse = await this._getUser(authId);

    if (!userResponse.success || (userResponse.result && userResponse.result.length === 0)) {
      return { success: false, errorMessage: userResponse.errorMessage };
    }
    let userId = userResponse.result![0]._id;

    // Updating existing template
    if (templateId) {
      let tagList: string[] | undefined;
      let tag: string | undefined;
      let dataList: JSON[] | undefined;
      let dataItem: JSON | undefined;

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

      let response = await this._updateTemplate(
        templateId,
        name,
        template,
        version,
        isPublished,
        state,
        isShareable,
        tag,
        tagList,
        dataItem,
        dataList,
        token
      );

      let newTags = tag ? [tag] : tagList ? tagList : [];
      // Update recent tags and recently edited template
      await this._updateRecentTags(authId, newTags);
      await this._updateRecentTemplate(authId, templateId, false);

      if (response.success) {
        return { success: true };
      }
      return {
        success: false,
        errorMessage: ServiceErrorMessage.InvalidTemplate
      };
    }
    const templateInstance: ITemplateInstance = {
      json: template,
      version: version || "1.0",
      publishedAt: isPublished ? new Date(Date.now()) : undefined,
      state: isPublished ? TemplateState.live : state ? state : TemplateState.draft,
      author: userId!,
      isShareable: isShareable || false,
      numHits: 0,
      data: data ? (data instanceof Array ? data : [data]) : [],
      updatedAt: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      lastEditedUser: authId
    };

    let templateName = name || "Untitled Template";

    let newTags = tags ? (tags instanceof Array ? tags : [tags]) : [];

    const newTemplate: ITemplate = {
      name: templateName,
      authors: [userId!],
      instances: [templateInstance],
      tags: newTags,
      deletedVersions: [],
      isLive: isPublished || false,
      updatedAt: new Date(Date.now())
    };

    // Update recent tags for user
    await this._updateRecentTags(authId, newTags);

    let response = await this.storageProvider.insertTemplate(newTemplate);
    if (response.success && response.result) {
      templateId = response.result;
      await this._updateRecentTemplate(authId, templateId, false);
    }
    return response;
  }

  /**
   * @private
   * Update user's recent tags list
   * @param tags
   */
  private async _updateRecentTags(authId: string, tags: string[]): Promise<JSONResponse<Number>> {
    if (tags.length === 0) return { success: true };

    // Update recently viewed for user
    let user = await this._getUser(authId);
    if (!user.success || !user.result || user.result.length !== 1) {
      return { success: false };
    }

    let recentTags = user.result[0].recentTags;
    for (let tag of tags) {
      if (recentTags!.includes(tag)) {
        let index = recentTags!.indexOf(tag);
        recentTags!.splice(index, 1);
      }
      if (recentTags!.length >= 10) {
        recentTags!.pop();
      }
      recentTags!.unshift(tag);
    }
    return await this._updateUser(authId, undefined, undefined, recentTags);
  }

  /**
   * @private
   * @param templateId
   * @param viewed - if true, adds given template id to viewed list for logged in user, otherwise adds to edited list
   */
  private async _updateRecentTemplate(authId: string, templateId: string, viewed: boolean): Promise<JSONResponse<Number>> {
    // Update recently viewed for user
    let user = await this._getUser(authId);
    if (!user.success || !user.result || user.result.length !== 1) {
      return { success: false };
    }
    let recentList = viewed ? user.result[0].recentlyViewedTemplates : user.result[0].recentlyEditedTemplates;

    if (recentList!.includes(templateId)) {
      let index = recentList!.indexOf(templateId);
      recentList!.splice(index, 1);
    }
    if (recentList!.length >= 5) {
      recentList!.pop();
    }
    recentList!.unshift(templateId);
    if (viewed) {
      return await this._updateUser(authId, recentList);
    }
    return await this._updateUser(authId, undefined, recentList);
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
     * @param {SortBy} sortBy - one of dateCreated, dateUpdated, alphabetical
     * @param {SortOrder} sortOrder - one of ascending, descending
     * @param {string[]} tags - filter by one or more tags
     * @param {boolean} isClient - used to ignore updating the hit number on a template
     * @returns Promise as valid json
     */
  public async getTemplates(
    token?: string,
    templateId?: string,
    state?: TemplateState,
    templateName?: string,
    version?: string,
    owned?: boolean,
    sortBy?: SortBy,
    sortOrder?: SortOrder,
    tags?: string[],
    isClient?: boolean
  ): Promise<JSONResponse<ITemplate[]>> {
    let authCheck = this._checkAuthenticated(token);
    if (!authCheck.success) {
      return authCheck;
    }
    let authId = this.authProvider.getAuthIDFromToken(token || this.authProvider.token);
    let userResponse = await this._getUser(authId);
    if (!userResponse.success || !userResponse.result || userResponse.result.length === 0) {
      return { success: false, errorMessage: userResponse.errorMessage };
    }

    let userId = userResponse.result![0]._id;
    const templateQuery: Partial<ITemplate> = {
      _id: templateId,
      name: templateName,
      tags: tags,
      authors: owned ? [userId!] : undefined
    };

    let response = await this.storageProvider.getTemplates(templateQuery, sortBy, sortOrder);

    if (!response.success || !response.result) return response;

    let templates: ITemplate[] = response.result;

    if (owned === false) {
      templates = await this._getOwnedTemplates(authId, templates, owned);
    }

    if (state) {
      let templatesFiltered = [];
      for (let template of templates) {
        let templateInstance = this._getStateTemplates(template, state);
        if (template.instances && template.instances.length > 0) {
          templatesFiltered.push(templateInstance);
        }
      }
      templates = templatesFiltered;
    }

    if (templateId && templates.length > 0) {
      if (!templates![0].authors.includes(userId!) && templates![0].isLive === false) return { success: true, result: [] };
      await this._updateRecentTemplate(authId, templateId, true);

      if (isClient === undefined || isClient === false) {
        // Update hit counter for template
        this._incrementTemplateHits(templateId, templates![0], version);
      }
      sortTemplateByVersion(templates![0]);
      if (!version) return { success: true, result: templates };
    }

    // Filter for the latest template version (instance)
    let resultTemplates: ITemplate[] = [];
    for (let template of templates) {
      if (template.isLive === false && !template.authors.includes(userId!)) continue;
      if (!template.instances) continue;
      if (version) {
        for (let instance of template.instances) {
          if (version && instance.version === version) {
            template.instances = [instance];
            resultTemplates.push(template);
            break;
          }
        }
      } else {
        updateTemplateToLatestInstance(template);
        resultTemplates.push(template);
      }
    }
    return { success: true, result: resultTemplates };
  }

  /**
   * @public
   * Get entry point.
   * Returns the specified template with the data bound into the template JSON.
   * If a version is passed in, it will update the template JSON of that version.
   * If not version is passed, it will update the latest version.
   * @param {string} templateId - unique template id
   * @param {JSON} data - data json to bound with template json
   * @param {string} version - version number, used with templateId
   * @param {boolean} isClient - used to ignore updating the hit number on a template
   * @returns Promise as valid json
   */
  public async bindData(
    templateId: string,
    data: JSON,
    version?: string,
    isClient?: boolean,
    token?: string,
  ): Promise<JSONResponse<ITemplate[]>> {
    let authCheck = this._checkAuthenticated(token);
    if (!authCheck.success) {
      return authCheck;
    }
    let authId = this.authProvider.getAuthIDFromToken(token || this.authProvider.token);
    let userResponse = await this._getUser(authId);
    if (!userResponse.success || !userResponse.result || userResponse.result.length === 0) {
      return { success: false, errorMessage: userResponse.errorMessage };
    }

    let userId = userResponse.result![0]._id;
    const templateQuery: Partial<ITemplate> = {
      _id: templateId,
    };

    let response = await this.storageProvider.getTemplates(templateQuery, undefined, undefined);

    if (!response.success || !response.result) return response;

    let templates: ITemplate[] = response.result;

    if (templates.length !== 1) {
      return { success: false, errorMessage: "Invalid template ID" };
    }

    if (isClient === undefined || isClient === false) {
      // Update hit counter for template
      this._incrementTemplateHits(templateId, templates![0], version);
    }

    sortTemplateByVersion(templates![0]);

    let template = templates[0];
    if (template.isLive === false && !template.authors.includes(userId!)) return { success: false, errorMessage: "Invalid user ID" };
    if (!template.instances) { return { success: false, errorMessage: "Invalid template ID" } };
    let selectedInstance = template.instances[0];
    if (version) {
      for (let instance of template.instances) {
        if (instance.version === version) {
          selectedInstance = instance;
          break;
        }
      }
    }
    let boundJSON: JSON = createCard(selectedInstance.json, data);
    selectedInstance.json = boundJSON;
    template.instances = [selectedInstance];
    return { success: true, result: [template] };
  }

  /**
   * @public
   * Delete template endpoint.
   * If the only template version is deleted, the entire template object is deleted.
   * If a version is not specified, the last version is deleted.
   * @param {string} templateId
   * @param {string} version
   */
  public async deleteTemplate(templateId: string, version?: string, token?: string): Promise<JSONResponse<Number>> {
    let authCheck = this._checkAuthenticated(token);
    if (!authCheck.success) {
      return authCheck;
    }

    if (!version) {
      let response = await this.getTemplates(token, templateId, undefined, undefined, undefined, undefined, undefined, undefined, undefined, true);
      if (!response.success || !response.result) {
        return { success: false, errorMessage: response.errorMessage };
      }
      if (response.result.length === 0) {
        return { success: true };
      }
      let latestVersion = getMostRecentVersion(response.result[0]);
      version = latestVersion?.version;
    }
    return this.batchDeleteTemplate(templateId, version ? [version] : [], token);
  }

  /**
   * @public
   * Delete template batch endpoint.
   * @param {string} templateId
   * @param {string[]} versionList
   * @param {string} token
   */
  public async batchDeleteTemplate(templateId: string, versionList: string[], token?: string): Promise<JSONResponse<Number>> {
    let authCheck = this._checkAuthenticated(token);
    if (!authCheck.success) {
      return authCheck;
    }
    let authId = this.authProvider.getAuthIDFromToken(token || this.authProvider.token);
    let userResponse = await this._getUser(authId);
    if (!userResponse.success) {
      return { success: false, errorMessage: userResponse.errorMessage };
    }

    let response = await this.getTemplates(token, templateId, undefined, undefined, undefined, undefined, undefined, undefined, undefined, true);
    if (!response.success || !response.result) {
      return { success: false, errorMessage: response.errorMessage };
    }
    if (response.result.length === 0) {
      return { success: true };
    }
    let template = response.result[0];

    if (!template.authors.includes(userResponse.result![0]._id!) && !template.isLive) {
      return { success: false, errorMessage: ServiceErrorMessage.UnauthorizedAction };
    }

    let templateObj: ITemplate;
    let templateInstances = [];
    let authorsList: string[] = [];
    for (let instance of template.instances || []) {
      if (!versionList.includes(instance.version)) {
        templateInstances.push(instance);
        if (!authorsList.includes(instance.author)) {
          authorsList.push(instance.author);
        }
      }
    }
    template.instances = templateInstances;
    template.deletedVersions?.push(...versionList);
    template.authors = authorsList;

    templateObj = template;

    // No instances, delete template object entirely
    if (templateObj.instances && templateObj.instances.length === 0) {
      return this.storageProvider.removeTemplate({ _id: templateId });
    }

    const query: Partial<ITemplate> = {
      _id: templateId
    };
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
    };

    let response = await this.storageProvider.getTemplates(templateQuery);
    if (!response.success || (response.result && response.result.length === 0)) {
      return { success: false, errorMessage: ServiceErrorMessage.FailedToRetrievePreview };
    }

    let template = response.result![0];
    let templateVersion = getTemplateVersion(template, version);
    if (!templateVersion || templateVersion.isShareable === false) {
      return { success: false, errorMessage: ServiceErrorMessage.FailedToRetrievePreview };
    }

    let userInfo = await this._searchUserInfo(templateVersion.author);
    if (!userInfo.success || !userInfo.result) {
      return { success: false, errorMessage: ServiceErrorMessage.FailedToRetrievePreview };
    }

    let templateInstance: TemplateInstancePreview = {
      version: version,
      json: templateVersion.json,
      state: templateVersion.state || TemplateState.draft,
      author: userInfo.result!,
      data: templateVersion.data ? templateVersion.data : []
    };

    logger.info(`Template of user with oid ${userInfo.result!} was requested in template preview.`);
    let templatePreview: TemplatePreview = {
      _id: templateId,
      name: template.name,
      instance: templateInstance,
      tags: template.tags || []
    };

    return { success: true, result: templatePreview };
  }

  /**
   * @private
   * @param viewed - If true, returns last 5 viewed templates, otherwise last 5 edited templates
   */
  private async _getRecentTemplates(viewed: boolean, token?: string): Promise<JSONResponse<ITemplate[]>> {
    let results: ITemplate[] = [];
    let response = await this._getUser(this.authProvider.getAuthIDFromToken(token || this.authProvider.token));
    if (!response.success || (response.result && response.result.length === 0)) {
      return { success: false, errorMessage: response.errorMessage };
    }

    let user: IUser = response.result![0];
    if ((viewed && !user.recentlyViewedTemplates) || (!viewed && !user.recentlyEditedTemplates)) {
      return { success: true, result: results };
    }

    let templateList = viewed ? user.recentlyViewedTemplates : user.recentlyEditedTemplates;
    for (let templateId of templateList!) {
      let templateResponse = await this.getTemplates(token, templateId, undefined, undefined, undefined, undefined, undefined, undefined, undefined, true);
      if (templateResponse.success && templateResponse.result && templateResponse.result.length === 1) {
        results.push(templateResponse.result[0]);
      }
    }
    return { success: true, result: results };
  }
  /**
   * @public
   * Retrieve a list of recently viewed templates for the logged in user.
   */
  public async getRecentlyViewedTemplates(token?: string): Promise<JSONResponse<ITemplate[]>> {
    let authCheck = this._checkAuthenticated(token);
    if (!authCheck.success) {
      return authCheck;
    }
    return this._getRecentTemplates(true, token);
  }

  /**
   * @public
   * Retrieve a list of recently edited templates for the logged in user.
   */
  public async getRecentlyEditedTemplates(token?: string): Promise<JSONResponse<ITemplate[]>> {
    let authCheck = this._checkAuthenticated(token);
    if (!authCheck.success) {
      return authCheck;
    }
    return this._getRecentTemplates(false, token);
  }

  /**
   * @private
   * @param token 
   */
  private async _getUserTags(token?: string): Promise<JSONResponse<string[][]>> {
    let authCheck = this._checkAuthenticated(token);
    if (!authCheck.success) {
      return authCheck;
    }

    let authId = this.authProvider.getAuthIDFromToken(token || this.authProvider.token);
    let response = await this._getUser(authId);
    if (!response.success) {
      return { success: false, errorMessage: response.errorMessage };
    }

    let user: IUser = response.result![0];
    return { success: true, result: [user.recentTags || [], user.favoriteTags || []] };
  }

  /**
   * @public
   * Retrieve a list of recently used tags for the logged in user.
   */
  public async getRecentTags(token?: string): Promise<JSONResponse<string[]>> {
    let response = await this._getUserTags(token);
    if (!response.success) {
      return { success: false, errorMessage: response.errorMessage };
    }
    return { success: true, result: response.result![0] };
  }

  /**
   * @public
   * Retrieve a list of favorite tags for the logged in user.
   */
  public async getFavoriteTags(token?: string): Promise<JSONResponse<string[]>> {
    let response = await this._getUserTags(token);
    if (!response.success) {
      return { success: false, errorMessage: response.errorMessage };
    }
    return { success: true, result: response.result![1] };
  }

  /**
   * @public
   * Get a list of tags available for logged in user to query by
   */
  public async getTags(token?: string): Promise<JSONResponse<TagList>> {
    let authCheck = this._checkAuthenticated(token);
    if (!authCheck.success) {
      return authCheck;
    }

    let authId = this.authProvider.getAuthIDFromToken(token || this.authProvider.token);
    let userResponse = await this._getUser(authId);
    if (!userResponse.success) {
      return { success: false, errorMessage: userResponse.errorMessage };
    }

    let allTags = new Set();
    let ownedTags = new Set();
    let response = await this.getTemplates(token, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, true);
    if (!response.success || !response.result) return { success: false, errorMessage: response.errorMessage };
    for (let template of response.result) {
      if (!template.tags) continue;
      if (template.authors.includes(userResponse.result![0]._id!)) {
        for (let tag of template.tags) {
          ownedTags.add(tag);
        }
      }
      for (let tag of template.tags) {
        allTags.add(tag);
      }
    }

    let favoriteTags: string[] = [];
    let favoriteResponse = await this.getFavoriteTags(token);
    if (favoriteResponse.success && favoriteResponse.result) favoriteTags = favoriteResponse.result;

    let list: TagList = {
      ownedTags: Array.from(ownedTags),
      allTags: Array.from(allTags),
      favoriteTags: favoriteTags
    };
    return { success: true, result: list };
  }

  /**
   * @private
   * Async function for authenticating users before running endpoint code.
   */
  private _routerAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "OPTIONS" || req.path.includes('preview')) {
      return next();
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
    return next();
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
    router.all("*", this._routerAuthentication);

    router.get("/", (req: Request, res: Response, _next: NextFunction) => {
      let token = parseToken(req.headers.authorization!);

      if (req.query.sortBy && !(req.query.sortBy in SortBy)) {
        const err = new TemplateError(ApiError.InvalidQueryParam, "Sort by value is not valid.");
        return res.status(400).json({ error: err });
      }

      if (req.query.sortOrder && !(req.query.sortOrder in SortOrder)) {
        const err = new TemplateError(ApiError.InvalidQueryParam, "Sort order value is not valid.");
        return res.status(400).json({ error: err });
      }
          
      let sortOrder: SortOrder = req.query.sortOrder? SortOrder[req.query.sortOrder as keyof typeof SortOrder] : SortOrder.ascending;
      let sortBy: SortBy =  req.query.sortBy? SortBy[req.query.sortBy as keyof typeof SortBy] : SortBy.alphabetical;
      let state: TemplateState | undefined = TemplateState[req.query.state as keyof typeof TemplateState];
      let owned: boolean | undefined = req.query.owned ? req.query.owned.toLowerCase() === "true" : undefined;
      let isClient: boolean | undefined = req.query.isClient ? req.query.isClient.toLowerCase() === "true" : undefined;
      let tagList: string[] = req.query.tags;

      this.getTemplates(token, undefined, state, req.query.name, req.query.version,
        owned, sortBy, sortOrder, tagList, isClient).then(response => {
          if (!response.success) {
            return res.status(200).json({ templates: [] });
          }
          res.status(200).json({ templates: response.result });
        });
    });

    router.get("/recent", async (req: Request, res: Response, _next: NextFunction) => {
      let token = parseToken(req.headers.authorization!);
      let response = await this.getRecentlyViewedTemplates(token);
      let recentlyViewedTemplates: ITemplate[] = [];
      if (response.success && response.result) {
        recentlyViewedTemplates = response.result;
      }

      response = await this.getRecentlyEditedTemplates(token);
      let recentlyEditedTemplates: ITemplate[] = [];
      if (response.success && response.result) {
        recentlyEditedTemplates = response.result;
      }

      let tagResponse = await this.getRecentTags(token);
      let recentTags: string[] = [];
      if (tagResponse.success && tagResponse.result) {
        recentTags = tagResponse.result;
      }

      res.status(200).json({
        recentlyViewed: {
          templates: recentlyViewedTemplates
        },
        recentlyEdited: {
          templates: recentlyEditedTemplates
        },
        recentlyUsed: {
          tags: recentTags
        }
      });
    });

    router.get("/tag", (req: Request, res: Response, _next: NextFunction) => {
      let token = parseToken(req.headers.authorization!);
      this.getTags(token).then(response => {
        if (!response.success) {
          return res.status(400).send();
        }
        res.status(200).json(response.result);
      });
    });

    router.post("/tag", async (req: Request, res: Response, _next: NextFunction) => {
      let token = parseToken(req.headers.authorization!);
      let favoriteTags: string[] = req.body.favorite || [];
      this.updateFavoriteTags(favoriteTags, [], token).then(response => {
        if (!response.success) {
          const err = new TemplateError(ApiError.TagUpdateFailed, "Unable to update favorite tags.");
          return res.status(400).json({ error: err });
        }
        res.status(200).send();
      })
    });

    router.delete("/tag", async (req: Request, res: Response, _next: NextFunction) => {
      let token = parseToken(req.headers.authorization!);
      let unfavoriteTags: string[] = req.body.favorite || [];
      this.updateFavoriteTags([], unfavoriteTags, token).then(response => {
        if (!response.success) {
          const err = new TemplateError(ApiError.TagUpdateFailed, "Unable to update favorite tags.");
          return res.status(400).json({ error: err });
        }
        res.status(200).send();
      })
    })

    router.get("/:id?", (req: Request, res: Response, _next: NextFunction) => {
      let isClient: boolean | undefined = req.query.isClient ? req.query.isClient.toLowerCase() === "true" : undefined;
      let token = parseToken(req.headers.authorization!);
      let state: TemplateState | undefined = TemplateState[req.query.state as keyof typeof TemplateState]

      this.getTemplates(token, req.params.id, state, undefined, req.query.version, undefined, undefined, undefined, undefined, isClient).then(
        response => {
          if (!response.success || (response.result && response.result.length === 0)) {
            const err = new TemplateError(ApiError.TemplateNotFound, `Template with id ${req.params.id} does not exist.`);
            return res.status(404).json({ error: err });
          }
          res.status(200).json({ templates: response.result });
        }
      );
    });

    router.get("/:id/preview", (req: Request, res: Response, _next: NextFunction) => {
      this.getTemplatePreview(req.params.id, req.query.version).then(response => {
        if (!response.success) {
          const err = new TemplateError(ApiError.TemplateNotFound, `Template with id ${req.params.id} does not exist.`);
          return res.status(404).json({ error: err });
        }
        res.status(200).json({ template: response.result });
      });
    });

    router.post("/:id?", async (req: Request, res: Response, _next: NextFunction) => {
      let token = parseToken(req.headers.authorization!);
      if (req.body.template !== undefined && (!(req.body.template instanceof Object) || !isValidJSONString(JSON.stringify(req.body.template)))) {
        const err = new TemplateError(ApiError.InvalidTemplate, `Template must be valid JSON.`);
        return res.status(400).json({ error: err });
      }

      let isPublished: boolean = req.body.isPublished;
      let isShareable: boolean = req.body.isShareable;
      if (!req.is("application/json")) {
        isPublished = req.body.isPublished && req.body.isPublished.toLowerCase() === "true";
        isShareable = req.body.isShareable && req.body.isShareable.toLowerCase() === "true";
      }

      let tags: string[] | string = req.body.tags;
      let data: JSON[] | JSON = req.body.data;

      let bindData: boolean | undefined = req.body.bindData ? req.body.bindData.toLowerCase() === "true" : undefined;

      if (bindData) {
        if (req.body.data !== undefined && (!(req.body.data instanceof Object) || !isValidJSONString(JSON.stringify(req.body.data)))) {
          const err = new TemplateError(ApiError.InvalidTemplate, `Data must be valid JSON.`);
          return res.status(400).json({ error: err });
        }
        let isClient: boolean | undefined = req.query.isClient ? req.query.isClient.toLowerCase() === "true" : undefined;

        let response = await this.bindData(
          req.params.id,
          req.body.data,
          req.body.version,
          isClient,
          token,
        )

        if (!response.success || (response.result && response.result.length === 0)) {
          const err = new TemplateError(ApiError.DataBindingFailed, response.errorMessage || "Data binding failed.");
          return res.status(400).json({ error: err });
        }
        return res.status(200).json({ templates: response.result });

      }

      let response = req.params.id
        ? await this.postTemplates(
          req.body.template,
          req.params.id,
          req.body.version,
          isPublished,
          req.body.name,
          req.body.state,
          isShareable,
          tags,
          data,
          token,
        )
        : await this.postTemplates(
          req.body.template,
          undefined,
          req.body.version,
          isPublished,
          req.body.name,
          req.body.state,
          isShareable,
          tags,
          data,
          token,
        );

      if (!response.success) {
        const err = new TemplateError(ApiError.InvalidTemplate, "Unable to create given template.");
        return res.status(400).json({ error: err });
      }

      return res.status(201).json({ id: response.result });
    });

    router.post("/:id/batch", async (req: Request, res: Response, _next: NextFunction) => {
      let token = parseToken(req.headers.authorization!);
      let requestList: TemplateStateRequest[] = req.body.templates;
      this.batchUpdateTemplate(req.params.id, requestList, token).then(response => {
        if (!response.success) {
          const err = new TemplateError(ApiError.InvalidTemplate, "Unable to update template versions.");
          return res.status(400).json({ error: err });
        }
        res.status(201).send();
      })
    });

    router.delete("/:id?", (req: Request, res: Response, _next: NextFunction) => {
      let token = parseToken(req.headers.authorization!);
      this.deleteTemplate(req.params.id, req.query.version, token).then(response => {
        if (!response.success) {
          const err = new TemplateError(ApiError.DeleteTemplateVersionFailed, `Failed to delete template ${req.params.id} version.`);
          return res.status(404).json({ error: err });
        }
        res.status(204).send();
      });
    });

    router.delete("/:id/batch", (req: Request, res: Response, _next: NextFunction) => {
      let token = parseToken(req.headers.authorization!);
      let versions: string[] = req.body.versions || [];
      this.batchDeleteTemplate(req.params.id, versions, token).then(response => {
        if (!response.success) {
          const err = new TemplateError(ApiError.DeleteTemplateVersionFailed, `Failed to delete template ${req.params.id} versions: ${versions}.`);
          return res.status(404).json({ error: err });
        }
        res.status(204).send();
      })
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

    router.get("/", (req: Request, res: Response, _next: NextFunction) => {
      let token = parseToken(req.headers.authorization!);
      this.getUser(token).then(response => {
        if (!response.success) {
          return res.status(200).json({ user: [] });
        }
        res.status(200).json({ user: response.result });
      });
    });

    router.delete("/", (req: Request, res: Response, _next: NextFunction) => {
      let token = parseToken(req.headers.authorization!);
      this.removeUser(token).then(response => {
        if (!response.success) {
          const err = new TemplateError(ApiError.DeleteUserInfoFailed, "Failed to delete user.");
          return res.status(500).json({ error: err });
        }
        res.status(204).send();
      });
    });

    return router;
  }

  public configExpressMiddleware(): Router {
    var router = express.Router();
    router.get("/", (_req: Request, res: Response, _next: NextFunction) => {
      return res.status(200).json({
        redirectUri: process.env.ACMS_REDIRECT_URI,
        appId: process.env.ACMS_APP_ID,
        appInsightsInstrumentationKey: process.env.ACMS_APP_INSIGHTS_INSTRUMENTATION_KEY,
        userInsightsInstrumentationKey: process.env.USER_APP_INSIGHTS_INSTRUMENTATION_KEY,
      });
    });
    return router;
  }

  private constructor(storageProvider: StorageProvider, authProvider: AuthenticationProvider) {
    this.storageProvider = storageProvider;
    this.authProvider = authProvider;
  }
}
