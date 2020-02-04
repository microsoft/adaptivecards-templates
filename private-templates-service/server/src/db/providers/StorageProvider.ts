import logger from "../../util/logger";

module Interface {
  export interface IUser {
    _id?: string;
    team: string[];
    org: string[];
    email: string;
  }

  export interface ITemplateInstance {
    json: string;
    version: string;
  }

  export interface ITemplate {
    _id?: string;
    instances: ITemplateInstance[];
    tags: string[];
    owner: string;
    createdAt: Date;
    updatedAt: Date;
    isPublished: boolean;
  }
  export interface JSONResponse<T> {
    success: boolean;
    errorMessage?: string;
    result?: T;
  }
}

module Queries {
  export interface TemplateQuery {
    templateID?: string;
    version?: string;
    tags?: string[];
    owner?: string;
    isPublished?: boolean;
    //sort based on date
    // permissions? : [enum]
  }

  export interface UserQuery {
    userID?: string;
    teamID?: string[];
    orgID?: string[];
    email?: string;
  }
}

module Collections {
  export class User implements Interface.IUser {
    _id?: string;
    team: string[] = new Array();
    org: string[] = new Array();
    email: string;

    constructor(team: string | string[], org: string | string[], email: string, _id?: string) {
      this.team = this.team.concat(team);
      this.org = this.org.concat(org);
      this.email = email;
      if (_id) {
        this._id = _id;
      }
    }

    static fromJSON(j: string): Interface.JSONResponse<Collections.User> {
      try {
        let userData: Interface.IUser = JSON.parse(j);
        return { success: true, result: new User(userData.team, userData.org, userData.email, userData._id) };
      } catch (e) {
        logger.error("Error with the JSON structure of the User object.");
        return { success: false, errorMessage: e };
      }
    }
  }

  export class TemplateInstance implements Interface.ITemplateInstance {
    json: string;
    version: string;
    constructor(j: string, version: string) {
      try {
        this.json = JSON.parse(j);
      } catch (e) {
        logger.error("JSON field of the template: " + j);
        throw new Error("JSON field of the template instance can't be parsed: invalid structure or empty string:\n" + e);
      }
      this.version = version;
    }
    static fromJSON(j: string): Interface.JSONResponse<Collections.TemplateInstance> {
      try {
        let instanceData: Interface.ITemplateInstance = JSON.parse(j);
        return { success: true, result: new Collections.TemplateInstance(JSON.stringify(instanceData.json), instanceData.version) };
      } catch (e) {
        logger.error("Error with the JSON structure of the template instance. Object can not be parsed:\n" + e);
        logger.error("Template Instance JSON: + " + j);
        return { success: true, errorMessage: e };
      }
    }
  }

  export class Template implements Interface.ITemplate {
    _id?: string;
    instances: Collections.TemplateInstance[] = new Array();
    tags: string[] = new Array();
    owner: string;
    createdAt: Date;
    updatedAt: Date;
    isPublished: boolean;
    constructor(
      instances: Collections.TemplateInstance[] | Collections.TemplateInstance,
      tags: string[] | string,
      owner: string,
      createdAt: Date,
      updatedAt: Date,
      isPublished: boolean,
      _id?: string
    ) {
      this.instances = this.instances.concat(instances);
      this.tags = this.tags.concat(tags);
      this.owner = owner;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.isPublished = isPublished;
      if (_id) {
        this._id = _id;
      }
    }

    getInstanceByVersion(version: string): Collections.TemplateInstance | undefined {
      return this.instances.find(instance => instance.version === version);
    }

    static fromJSON(j: string): Collections.Template | null {
      try {
        let template: Interface.ITemplate = JSON.parse(j);
        let templateInstances: Collections.TemplateInstance[] = new Array();
        template.instances.forEach(instance => {
          let templateInstance: Interface.JSONResponse<Collections.TemplateInstance> = Collections.TemplateInstance.fromJSON(JSON.stringify(instance));
          if (templateInstance.success) {
            templateInstances.push(templateInstance.result!);
          } else {
            throw new Error("Error in parsing Templates: one or more of the instances couldn't be correctly parsed.");
          }
        });
        return new Template(templateInstances, template.tags, template.owner, new Date(template.createdAt), new Date(template.updatedAt), template.isPublished, template._id);
      } catch (e) {
        logger.error(e);
        return null;
      }
    }
  }
}
// Base class for all the StorageProviders.
abstract class StorageProvider {
  protected connectionString: string;
  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  abstract async getUser(query: Queries.UserQuery): Promise<Collections.User[]>;
  abstract async getTemplate(query: Queries.TemplateQuery): Promise<Collections.Template[]>;
  abstract async insertUser(user: Collections.User): Promise<void>;
  abstract async insertTemplate(user: Collections.Template): Promise<void>;
  abstract async removeUser(query: Queries.UserQuery): Promise<boolean>;
  abstract async removeTemplate(query: Queries.TemplateQuery): Promise<boolean>;
}

export { Collections, Interface, Queries, StorageProvider };
