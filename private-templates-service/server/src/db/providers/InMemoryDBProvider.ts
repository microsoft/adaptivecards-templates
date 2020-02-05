import { JSONResponse, IUser, ITemplate, ITemplateInstance } from "../models/models";
import { StorageProvider } from "../models/StorageProvider";
import logger from "../../util/logger";
import uuidv4 from "uuid/v4";

export class InMemoryDBProvider implements StorageProvider {
  users: Map<string, IUser> = new Map();
  templates: Map<string, ITemplate> = new Map();

  constructor() {}

  private _updateUser(user: IUser, updateQuery: Partial<IUser>): void {
    this.users.set(user.id!, { ...user, ...updateQuery });
  }

  private _updateTemplate(template: ITemplate, updateQuery: Partial<ITemplate>): void {
    this.templates.set(template.id!, { ...template, ...updateQuery });
  }

  async updateUser(query: Partial<IUser>, updateQuery: Partial<IUser>): Promise<JSONResponse<Number>> {
    let updateCount: number = 0;
    this._matchUsers(query).then(response => {
      response.result!.forEach(user => {
        updateCount += 1;
        this._updateUser(user, this._clone(updateQuery));
      });
    });
    return Promise.resolve({ success: true, result: updateCount });
  }
  async updateTemplate(query: Partial<ITemplate>, updateQuery: Partial<ITemplate>): Promise<JSONResponse<Number>> {
    let updateCount: number = 0;
    this._matchTemplates(query).then(response => {
      response.result!.forEach(template => {
        updateCount += 1;
        this._updateTemplate(template, this._clone(updateQuery));
      });
    });
    return Promise.resolve({ success: true, result: updateCount });
  }

  async insertUser(doc: IUser): Promise<JSONResponse<Number>> {
    return this._insert(doc, this.users);
  }
  async insertTemplate(doc: ITemplate): Promise<JSONResponse<Number>> {
    this._setTimestamps(doc);
    return this._insert(doc, this.templates);
  }

  async getUser(query: Partial<IUser>): Promise<JSONResponse<IUser[]>> {
    return this._matchUsers(query);
  }

  async getTemplate(query: Partial<ITemplate>): Promise<JSONResponse<ITemplate[]>> {
    return this._matchTemplates(query);
  }

  // Will be fixed in a while to use JSONResponse
  async removeUser(query: Partial<ITemplate>): Promise<JSONResponse<Number>> {
    let removeCount: number = 0;
    await this._matchUsers(query).then(response => {
      response.result!.forEach(user => {
        removeCount += 1;
        this.users.delete(user.id!);
      });
    });
    return Promise.resolve({ success: true, result: removeCount });
  }
  async removeTemplate(query: Partial<ITemplate>): Promise<JSONResponse<Number>> {
    let removeCount: number = 0;
    await this._matchTemplates(query).then(response => {
      response.result!.forEach(template => {
        removeCount += 1;
        this.templates.delete(template.id!);
      });
    });
    return Promise.resolve({ success: true, result: removeCount });
  }

  protected async _matchUsers(query: Partial<ITemplate>): Promise<JSONResponse<IUser[]>> {
    let res: IUser[] = new Array();
    this.users.forEach(user => {
      if (this._matchUser(query, user)) {
        res.push(this._clone(user));
      }
    });
    return Promise.resolve({ success: true, result: res });
  }

  protected async _matchTemplates(query: Partial<ITemplate>): Promise<JSONResponse<ITemplate[]>> {
    let res: ITemplate[] = new Array();
    this.templates.forEach(template => {
      if (this._matchTemplate(query, template)) {
        res.push(this._clone(template));
      }
    });
    return Promise.resolve({ success: true, result: res });
  }

  protected _clone<T>(obj: T): T {
    let cloned: T = JSON.parse(JSON.stringify(obj));
    return cloned;
  }

  protected async _insert<T extends ITemplate | IUser>(doc: T, collection: Map<String, T>): Promise<JSONResponse<Number>> {
    let docToInsert: T = this._clone(doc);
    this._setID(docToInsert);
    if (!collection.has(docToInsert.id!)) {
      collection.set(docToInsert.id!, docToInsert);
      return Promise.resolve({ success: true, result: 1 });
    } else {
      logger.error("Object with id: %s already exists. Insertion failed", doc.id!);
      return Promise.resolve({ success: false, result: 0, errorMessage: "Object with id: " + doc.id! + "already exists. Insertion failed" });
    }
  }

  // Makes sure that id of the object is set
  protected _setID<T extends ITemplate | IUser>(doc: T) {
    if (!doc.id) {
      doc.id = uuidv4();
    }
  }

  protected _setTimestamps(doc: ITemplate): void {
    doc.createdAt = new Date(Date.now());
  }

  protected _matchUser(query: Partial<IUser>, user: IUser): boolean {
    if (
      (query.id && !(query.id === user.id)) ||
      (query.email && !(query.email === user.email)) ||
      (query.org && !this._ifContainsList(user.org, query.org)) ||
      (query.team && !this._ifContainsList(user.team, query.team))
    ) {
      return false;
    }
    return true;
  }

  protected _ifContainsList<T>(toVerify: T[], list: T[]): boolean {
    list.forEach(obj => {
      if (!toVerify.includes(obj)) {
        return false;
      }
    });
    return true;
  }

  // Omitted version search for now
  protected _matchTemplate(query: Partial<ITemplate>, template: ITemplate): boolean {
    if (
      (query.owner && !(query.owner === template.owner)) ||
      (query.id && !(query.id === template.id)) ||
      (query.isPublished && !(query.isPublished === template.isPublished)) ||
      (query.tags && !this._ifContainsList(template.tags, query.tags))
    ) {
      console.log("false");
      return false;
    }
    return true;
  }
}
