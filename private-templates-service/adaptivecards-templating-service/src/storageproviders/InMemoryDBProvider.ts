import { JSONResponse, IUser, ITemplate, SortBy, SortOrder, ITemplateInstance, TemplateState } from "../models/models";
import { StorageProvider } from "./IStorageProvider";
import * as Utils from "../util/inmemorydbutils/inmemorydbutils";
import { MongoUtils } from "../util/mongoutils/mongoutils";
import uuidv4 from "uuid/v4";

export class InMemoryDBProvider implements StorageProvider {
  users: Map<string, IUser> = new Map();
  templates: Map<string, ITemplate> = new Map();

  constructor() {}

  private _updateUser(user: IUser, updateQuery: Partial<IUser>): void {
    this.users.set(user._id!, { ...user, ...updateQuery });
  }

  private _updateTemplate(template: ITemplate, updateQuery: Partial<ITemplate>): void {
    template.updatedAt = new Date(Date.now());
    this.templates.set(template._id!, { ...template, ...updateQuery });
  }

  async updateUser(query: Partial<IUser>, updateQuery: Partial<IUser>): Promise<JSONResponse<Number>> {
    let updateCount: number = 0;
    await this._matchUsers(query).then(response => {
      if (response.success) {
        response.result!.forEach(user => {
          updateCount += 1;
          this._updateUser(user, Utils.clone(updateQuery));
        });
      }
    });
    if (updateCount) {
      return Promise.resolve({ success: true, result: updateCount });
    }
    return Promise.resolve({
      success: false,
      errorMessage: "No users found matching given criteria"
    });
  }
  async updateTemplate(query: Partial<ITemplate>, updateQuery: Partial<ITemplate>): Promise<JSONResponse<Number>> {
    let updateCount: number = 0;
    let response = await this._matchTemplates(query);
    if (response.success) {
      response.result!.forEach(template => {
        updateCount += 1;
        this._updateTemplate(template, Utils.clone(updateQuery));
      });
    }
    if (updateCount) {
      return Promise.resolve({ success: true, result: updateCount });
    }
    return Promise.resolve({
      success: false,
      errorMessage: "No templates found matching given criteria"
    });
  }

  async insertUser(doc: IUser): Promise<JSONResponse<string>> {
    return this._insert(doc, this.users, this._autoCompleteUserModel.bind(this));
  }

  async insertTemplate(doc: ITemplate): Promise<JSONResponse<string>> {
    return this._insert(doc, this.templates, this._autoCompleteTemplateModel.bind(this));
  }

  async getUsers(query: Partial<IUser>): Promise<JSONResponse<IUser[]>> {
    return this._matchUsers(query);
  }

  async getTemplates(
    query: Partial<ITemplate>,
    sortBy: SortBy = SortBy.alphabetical,
    sortOrder: SortOrder = SortOrder.ascending
  ): Promise<JSONResponse<ITemplate[]>> {
    return this._matchTemplates(query, sortBy, sortOrder);
  }

  // Will be fixed in a while to use JSONResponse
  async removeUser(query: Partial<ITemplate>): Promise<JSONResponse<Number>> {
    let removeCount: number = 0;
    await this._matchUsers(query).then(response => {
      response.result!.forEach(user => {
        removeCount += 1;
        this.users.delete(user._id!);
      });
    });
    if (removeCount) {
      return Promise.resolve({ success: true, result: removeCount });
    }
    return Promise.resolve({
      success: false,
      errorMessage: "No users found matching given criteria"
    });
  }
  async removeTemplate(query: Partial<ITemplate>): Promise<JSONResponse<Number>> {
    let removeCount: number = 0;
    await this._matchTemplates(query).then(response => {
      if (response.success) {
        response.result!.forEach(template => {
          removeCount += 1;
          this.templates.delete(template._id!);
        });
      }
    });

    if (removeCount) {
      return Promise.resolve({ success: true, result: removeCount });
    }
    return Promise.resolve({
      success: false,
      errorMessage: "No users found matching given criteria"
    });
  }

  protected async _matchUsers(query: Partial<ITemplate>): Promise<JSONResponse<IUser[]>> {
    let res: IUser[] = new Array();
    this.users.forEach(user => {
      if (this._matchUser(query, user)) {
        res.push(Utils.clone(user));
      }
    });
    if (res.length) {
      return Promise.resolve({ success: true, result: res });
    }
    return Promise.resolve({ success: false });
  }

  protected async _matchTemplates(query: Partial<ITemplate>, sortBy?: SortBy, sortOrder?: SortOrder): Promise<JSONResponse<ITemplate[]>> {
    let res: ITemplate[] = new Array();
    this.templates.forEach(template => {
      if (this._matchTemplate(query, template)) {
        res.push(Utils.clone(template));
      }
    });
    if (res.length) {
      if (sortBy && sortOrder) {
        res.sort(Utils.sortByField(sortBy, sortOrder));
      }
      return Promise.resolve({ success: true, result: res });
    }
    return Promise.resolve({ success: false });
  }

  protected _autoCompleteUserModel(user: IUser): void {
    if (!user.recentlyViewedTemplates) {
      user.recentlyViewedTemplates = [];
    }
    if (!user.recentlyEditedTemplates) {
      user.recentlyEditedTemplates = [];
    }
    if (!user.recentTags) {
      user.recentTags = [];
    }
    if (!user.favoriteTags) {
      user.favoriteTags = [];
    }
    this._setID(user);
  }

  protected _autoCompleteTemplateInstanceModel(instance: ITemplateInstance): void {
    if (!instance.state) {
      instance.state = TemplateState.draft;
    }
    if (!instance.isShareable) {
      instance.isShareable = false;
    }
    if (!instance.numHits) {
      instance.numHits = 0;
    }
    if (!instance.data) {
      instance.data = [];
    }
    if (!instance.publishedAt) {
      instance.publishedAt = new Date("null");
    }
    if(!instance.lastEditedUser) {
      instance.lastEditedUser = "";
    }
    if (!instance.author) {
      instance.author = "";
    }
  }
  protected _autoCompleteTemplateModel(template: ITemplate): void {
    if (!template.tags) {
      template.tags = [];
    } else {
      template.tags = template.tags.map(x => {
        return x.toLowerCase();
      });
    }
    if (!template.isLive) {
      template.isLive = false;
    }
    if (!template.instances) {
      template.instances = [];
    } else {
      for (let instance of template.instances) {
        this._autoCompleteTemplateInstanceModel(instance);
      }
    }
    if (!template.deletedVersions) {
      template.deletedVersions = [];
    }
    this._setTimestamps(template);
    this._setID(template);
  }

  protected async _insert<T extends ITemplate | IUser>(
    doc: T,
    collection: Map<String, T>,
    autoComplete: (doc: T) => void
  ): Promise<JSONResponse<string>> {
    let docToInsert: T = Utils.clone(doc);
    autoComplete(docToInsert);
    if (!collection.has(docToInsert._id!)) {
      collection.set(docToInsert._id!, docToInsert);
      return Promise.resolve({ success: true, result: docToInsert._id });
    } else {
      return Promise.resolve({
        success: false,
        errorMessage: "Object with id: " + doc._id! + "already exists. Insertion failed"
      });
    }
  }

  // Makes sure that id of the object is set
  protected _setID<T extends ITemplate | IUser>(doc: T) {
    if (!doc._id) {
      doc._id = uuidv4();
    }
  }

  protected _setTimestamps(doc: ITemplate): void {
    let currentDate: Date = new Date(Date.now());
    doc.createdAt = currentDate;
    doc.updatedAt = currentDate;
    if (doc.instances) {
      for (let instance of doc.instances) {
        instance.createdAt = currentDate;
        instance.updatedAt = currentDate;
      }
    }
  }

  protected _matchUser(query: Partial<IUser>, user: IUser): boolean {
    if (
      (query._id && !(query._id === user._id)) ||
      (query.authId && !(query.authId === user.authId)) ||
      (query.authIssuer && !(query.authIssuer === user.authIssuer))
    ) {
      return false;
    }
    return true;
  }

  protected _matchTemplate(query: Partial<ITemplate>, template: ITemplate): boolean {
    query = MongoUtils.removeUndefinedFields(query);
    if(!Object.keys(query).length) {
      return true;
    }
    else if (
      (query.name && template.name.toLocaleUpperCase().includes(query.name.toLocaleUpperCase())) ||  
      (query._id && (query._id === template._id)) ||
      (query.isLive && (query.isLive === template.isLive)) || 
      (query.tags && template.tags && Utils.ifContainsList(template.tags,query.tags)) || 
      (query.authors && query.authors.every((value:string) => template.authors.includes(value)))
    ){
      return true;
    }
      return false
    }

  async connect(): Promise<JSONResponse<Boolean>> {
    return Promise.resolve({ success: true });
  }
  async close(): Promise<JSONResponse<Boolean>> {
    return Promise.resolve({ success: true });
  }
}
