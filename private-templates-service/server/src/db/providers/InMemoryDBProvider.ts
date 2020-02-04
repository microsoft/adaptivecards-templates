import { Queries, Collections, StorageProvider, Interface } from "./StorageProvider";
import logger from "../../util/logger";
import uuidv4 from "uuid/v4";

export class InMemoryDBProvider extends StorageProvider {
  users: Map<string, Collections.User> = new Map();
  templates: Map<string, Collections.Template> = new Map();

  constructor() {
    super("");
  }

  async insertUser(doc: Collections.User): Promise<void> {
    return this._insert(doc, this.users);
  }
  async insertTemplate(doc: Collections.Template): Promise<void> {
    this._setTimestamps(doc);
    return this._insert(doc, this.templates);
  }

  async getUser(query: Queries.UserQuery): Promise<Collections.User[]> {
    return this._matchUsers(query);
  }

  async getTemplate(query: Queries.TemplateQuery): Promise<Collections.Template[]> {
    return this._matchTemplates(query);
  }

  // Will be fixed in a while to use JSONResponse
  async removeUser(query: Queries.UserQuery): Promise<boolean> {
    await this._matchUsers(query).then(users => {
      users.forEach(user => {
        this.users.delete(user._id!);
      });
    });
    return Promise.resolve(true);
  }
  async removeTemplate(query: Queries.TemplateQuery): Promise<boolean> {
    await this._matchTemplates(query).then(templates => {
      templates.forEach(template => {
        this.templates.delete(template._id!);
      });
    });
    return Promise.resolve(true);
  }

  private async _matchUsers(query: Queries.UserQuery): Promise<Collections.User[]> {
    let res: Collections.User[] = new Array();
    this.users.forEach(user => {
      if (this._matchUser(query, user)) {
        res.push(user);
      }
    });
    return Promise.resolve(res);
  }

  private async _matchTemplates(query: Queries.TemplateQuery): Promise<Collections.Template[]> {
    let res: Collections.Template[] = new Array();
    this.templates.forEach(template => {
      if (this._matchTemplate(query, template)) {
        res.push(template);
      }
    });
    return Promise.resolve(res);
  }

  private async _insert<T extends Collections.Template | Collections.User>(doc: T, collection: Map<String, T>): Promise<void> {
    this._checkID(doc);
    if (!collection.has(doc._id!)) {
      collection.set(doc._id!, doc);
    } else {
      logger.error("Object with id: " + doc._id + " already exists. Insertion failed");
    }
  }

  // Makes sure that id of the object is set
  private _checkID<T extends Interface.ITemplate | Interface.IUser>(doc: T) {
    if (!doc._id) {
      doc._id = uuidv4();
    }
  }

  private _setTimestamps(doc: Collections.Template): void {
    doc.createdAt = new Date(Date.now());
  }

  private _matchUser(query: Queries.UserQuery, user: Collections.User): boolean {
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

  private _matchTemplate(query: Queries.TemplateQuery, template: Collections.Template): boolean {
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
