import { StorageProvider } from "./IStorageProvider";
import { IUser, ITemplate, JSONResponse, SortBy, SortOrder } from "../models/models";
import { MongoConnectionParams } from "../models/mongo/MongoConnectionParams";
import { MongoWorker } from "../util/mongoutils/MongoWorker";

export class MongoDBProvider implements StorageProvider {
  worker: MongoWorker;

  constructor(params: MongoConnectionParams) {
    this.worker = new MongoWorker(params);
  }

  // Construct functions are introduced to be able to search by
  // nested objects. For example, if team:["merlin", "morgana"] are
  // provided in the query, then we need to add operator $all
  // to make sure they're both in the returned user 'team' field
  private _constructUserQuery(query: Partial<IUser>): any {
    let userQuery: any = { ...query };
    if (query.team) {
      userQuery.team = { $all: query.team };
    }
    if (query.org) {
      userQuery.org = { $all: query.org };
    }
    return userQuery;
  }
  private _constructTemplateQuery(query: Partial<ITemplate>): any {
    let templateQuery: any = { ...query };
    if (query.name) {
      templateQuery.name = { $regex: query.name, $options: "i" };
    }
    if (query.tags) {
      templateQuery.tags = { $all: query.tags };
    }
    return templateQuery;
  }
  async getUsers(query: Partial<IUser>): Promise<JSONResponse<IUser[]>> {
    let userQuery: any = this._constructUserQuery(query);
    return await this.worker.User.find(userQuery)
      .then(users => {
        if (users.length) {
          return Promise.resolve({
            success: true,
            result: users
          });
        }
        return Promise.resolve({
          success: false,
          errorMessage: "No users found matching given criteria"
        }) as Promise<JSONResponse<IUser[]>>; // "as" has to be used because TypeScript cannot deduce the type correctly
      })
      .catch(e => {
        return Promise.resolve({ success: false, errorMessage: e });
      });
  }

  // Default sort is by name and in ascending order.
  async getTemplates(
    query: Partial<ITemplate>,
    sortBy: SortBy = SortBy.name,
    sortOrder: SortOrder = SortOrder.ascending
  ): Promise<JSONResponse<ITemplate[]>> {
    let templateQuery: any = this._constructTemplateQuery(query);
    return await this.worker.Template.find(templateQuery, {})
      .sort({ [sortBy]: sortOrder })
      .then(templates => {
        if (templates.length) {
          return Promise.resolve({
            success: true,
            result: templates
          });
        }
        return Promise.resolve({
          success: false,
          errorMessage: "No templates found matching given criteria"
        }) as Promise<JSONResponse<ITemplate[]>>; // "as" has to be used because TypeScript cannot deduce the type correctly
      })
      .catch(e => {
        return Promise.resolve({ success: false, errorMessage: e });
      });
  }
  // Updates Only one user
  async updateUser(query: Partial<IUser>, updateQuery: Partial<IUser>): Promise<JSONResponse<Number>> {
    let userQuery: any = this._constructUserQuery(query);
    return await this.worker.User.findOneAndUpdate(userQuery, updateQuery)
      .then(result => {
        if (result) {
          return Promise.resolve({
            success: true
          });
        }
        return Promise.resolve({
          success: false,
          errorMessage: "No users found matching given criteria."
        });
      })
      .catch(e => {
        return Promise.resolve({
          success: false,
          errorMessage: e
        });
      });
  }
  async updateTemplate(query: Partial<ITemplate>, updateQuery: Partial<ITemplate>): Promise<JSONResponse<Number>> {
    let templateQuery: any = this._constructTemplateQuery(query);
    return await this.worker.Template.findOneAndUpdate(templateQuery, updateQuery)
      .then(result => {
        if (result) {
          return Promise.resolve({ success: true });
        }
        return Promise.resolve({
          success: false,
          errorMessage: "No templates found matching given criteria."
        });
      })
      .catch(e => {
        return Promise.resolve({
          success: false,
          errorMessage: e
        });
      });
  }
  async insertUser(user: IUser): Promise<JSONResponse<string>> {
    return await this.worker.User.create(user)
      .then(result => {
        return Promise.resolve({ success: true, result: result.id });
      })
      .catch(e => {
        return Promise.resolve({
          success: false,
          errorMessage: e
        });
      });
  }
  async insertTemplate(template: ITemplate): Promise<JSONResponse<string>> {
    return await this.worker.Template.create(template)
      .then(result => {
        return Promise.resolve({ success: true, result: result.id });
      })
      .catch(e => {
        return Promise.resolve({
          success: false,
          errorMessage: e
        });
      });
  }
  async removeUser(query: Partial<IUser>): Promise<JSONResponse<Number>> {
    let userQuery: any = this._constructUserQuery(query);
    return await this.worker.User.deleteOne(userQuery)
      .then(result => {
        if (result.deletedCount) {
          return Promise.resolve({
            success: true
          });
        }
        return Promise.resolve({
          success: false,
          errorMessage: "No users found matching given criteria"
        });
      })
      .catch(e => {
        return Promise.resolve({
          success: false,
          errorMessage: e
        });
      });
  }
  async removeTemplate(query: Partial<ITemplate>): Promise<JSONResponse<Number>> {
    let templateQuery: any = this._constructTemplateQuery(query);
    console.log(templateQuery);
    return await this.worker.Template.deleteOne(templateQuery)
      .then(result => {
        if (result.deletedCount) {
          return Promise.resolve({
            success: true
          });
        }
        return Promise.resolve({
          success: false,
          errorMessage: "No templates found matching given criteria"
        });
      })
      .catch(e => {
        return Promise.resolve({
          success: false,
          errorMessage: e
        });
      });
  }

  async connect(): Promise<JSONResponse<Boolean>> {
    return await this.worker.connect();
  }

  async close(): Promise<JSONResponse<Boolean>> {
    return this.worker.close();
  }
}
