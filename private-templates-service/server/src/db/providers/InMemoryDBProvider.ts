import { UserQuery, TemplateQuery, JSONResponse, IUser, ITemplate, ITemplateInstance } from "../models/models";
import { StorageProvider } from "../models/StorageProvider";
import logger from "../../util/logger";
import uuidv4 from "uuid/v4";

export class InMemoryDBProvider implements StorageProvider {
  users: Map<string, IUser> = new Map();
  templates: Map<string, ITemplate> = new Map();

  constructor() {}

  private _updateUser(user: IUser, updateQuery: UserQuery): void {
    if (updateQuery.email != undefined) {
      user.email = updateQuery.email;
    }
    if (updateQuery.orgID != undefined) {
      user.org = updateQuery.orgID;
    }
    if (updateQuery.teamID != undefined) {
      user.team = updateQuery.teamID;
    }
    this.users.set(user._id!, user);
  }

  private _updateTemplate(template: ITemplate, updateQuery: TemplateQuery): void {
    if (updateQuery.isPublished != undefined) {
      template.isPublished = updateQuery.isPublished;
    }
    if (updateQuery.owner != undefined) {
      template.owner = updateQuery.owner;
    }
    if (updateQuery.tags != undefined) {
      template.tags = updateQuery.tags;
    }
    if (updateQuery.instances != undefined) {
      template.instances = this._clone(updateQuery.instances);
    }
    this.templates.set(template._id!, template);
  }

  async updateUser(query: UserQuery, updateQuery: UserQuery): Promise<JSONResponse<Number>> {
    let updateCount: number = 0;
    this._matchUsers(query).then(users => {
      users.forEach(user => {
        updateCount += 1;
        this._updateUser(user, updateQuery);
      });
    });
    return Promise.resolve({ success: true, result: updateCount });
  }
  async updateTemplate(query: TemplateQuery, updateQuery: TemplateQuery): Promise<JSONResponse<Number>> {
    let updateCount: number = 0;
    this._matchTemplates(query).then(templates => {
      templates.forEach(template => {
        updateCount += 1;
        this._updateTemplate(template, updateQuery);
      });
    });
    return Promise.resolve({ success: true, result: updateCount });
  }

  async insertUser(doc: IUser): Promise<void> {
    if (this._clone(doc).org === doc.org) {
      console.log("fuck");
    }
    return this._insert(doc, this.users);
  }
  async insertTemplate(doc: ITemplate): Promise<void> {
    this._setTimestamps(doc);
    return this._insert(doc, this.templates);
  }

  async getUser(query: UserQuery): Promise<IUser[]> {
    return this._matchUsers(query);
  }

  async getTemplate(query: TemplateQuery): Promise<ITemplate[]> {
    return this._matchTemplates(query);
  }

  // Will be fixed in a while to use JSONResponse
  async removeUser(query: UserQuery): Promise<JSONResponse<Number>> {
    let removeCount: number = 0;
    await this._matchUsers(query).then(users => {
      users.forEach(user => {
        removeCount += 1;
        this.users.delete(user._id!);
      });
    });
    return Promise.resolve({ success: true, result: removeCount });
  }
  async removeTemplate(query: TemplateQuery): Promise<JSONResponse<Number>> {
    let removeCount: number = 0;
    await this._matchTemplates(query).then(templates => {
      templates.forEach(template => {
        removeCount += 1;
        this.templates.delete(template._id!);
      });
    });
    return Promise.resolve({ success: true, result: removeCount });
  }

  protected async _matchUsers(query: UserQuery): Promise<IUser[]> {
    let res: IUser[] = new Array();
    this.users.forEach(user => {
      if (this._matchUser(query, user)) {
        res.push(this._clone(user));
      }
    });
    return Promise.resolve(res);
  }

  protected async _matchTemplates(query: TemplateQuery): Promise<ITemplate[]> {
    let res: ITemplate[] = new Array();
    this.templates.forEach(template => {
      if (this._matchTemplate(query, template)) {
        res.push(this._clone(template));
      }
    });
    return Promise.resolve(res);
  }

  protected _clone<T>(obj: T): T {
    let cloned: T = JSON.parse(JSON.stringify(obj));
    return cloned;
  }

  protected async _insert<T extends ITemplate | IUser>(doc: T, collection: Map<String, T>): Promise<void> {
    let docToInsert: T = this._clone(doc);
    this._checkID(docToInsert);
    if (!collection.has(docToInsert._id!)) {
      collection.set(docToInsert._id!, docToInsert);
    } else {
      logger.error("Object with id: %s already exists. Insertion failed", doc._id!);
    }
  }

  // Makes sure that id of the object is set
  protected _checkID<T extends ITemplate | IUser>(doc: T) {
    if (!doc._id) {
      doc._id = uuidv4();
    }
  }

  protected _setTimestamps(doc: ITemplate): void {
    doc.createdAt = new Date(Date.now());
  }

  protected _matchUser(query: UserQuery, user: IUser): boolean {
    if (query.userID && !(query.userID === user._id)) {
      return false;
    }
    if (query.email && !(query.email === user.email)) {
      return false;
    }

    if (query.orgID) {
      for (let org of query.orgID) {
        if (!user.org.includes(org)) {
          return false;
        }
      }
    }

    if (query.teamID) {
      for (let team of query.teamID) {
        if (!user.team.includes(team)) {
          return false;
        }
      }
    }
    return true;
  }

  protected _matchTemplate(query: TemplateQuery, template: ITemplate): boolean {
    if (query.owner && !(query.owner === template.owner)) {
      return false;
    }
    if (query.templateID && !(query.templateID === template._id)) {
      return false;
    }

    if (query.isPublished && !(query.isPublished === template.isPublished)) {
      return false;
    }

    if (query.tags) {
      for (let tag of query.tags) {
        if (!template.tags.includes(tag)) {
          return false;
        }
      }
    }

    if (query.version) {
      let ifVersion: boolean = false;
      for (let instance of template.instances) {
        if (instance.version === query.version) {
          ifVersion = true;
          break;
        }
      }
      if (!ifVersion) {
        return false;
      }
    }

    return true;
  }
}
