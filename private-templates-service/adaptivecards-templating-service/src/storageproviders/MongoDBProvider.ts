import mongoose from "mongoose";
import { StorageProvider } from "./IStorageProvider";
import { IUser, ITemplate, JSONResponse } from "../models/models";
import { IUserModel, UserSchema } from "../models/mongo/UserModel";
import { ITemplateModel, TemplateSchema } from "../models/mongo/TemplateModel";
import { Mongo } from "../util/mongoutils";

const USERS_COLLECTION_NAME_SINGULAR: string = "User";
const TEMPLATES_COLLECTION_NAME_SINGULAR: string = "Template";

export class MongoDBProvider implements StorageProvider {
  Template!: mongoose.Model<ITemplateModel>;
  User!: mongoose.Model<IUserModel>;
  db!: mongoose.Connection;
  connectionString: string;
  options: any;

  constructor(connectionString: string, options: any) {
    this.connectionString = connectionString;
    this.options = options;
  }

  async getUser(query: Partial<IUser>): Promise<JSONResponse<IUser[]>> {
    return await this.User.find(query)
      .then(users => {
        if (users.length) {
          return Promise.resolve({
            success: true,
            result: users
          });
        }
        return Promise.resolve({
          success: false,
          result: [],
          errorMessage: "No users found matching given criteria"
        });
      })
      .catch(e => {
        return Promise.resolve({ success: false, errorMessage: e });
      });
  }
  async getTemplate(query: Partial<ITemplate>): Promise<JSONResponse<ITemplate[]>> {
    return await this.Template.find(query)
      .then(templates => {
        if (templates.length) {
          return Promise.resolve({
            success: true,
            result: templates
          });
        }
        return Promise.resolve({
          success: false,
          result: [],
          errorMessage: "No templates found matching given criteria"
        });
      })
      .catch(e => {
        return Promise.resolve({ success: false, errorMessage: e });
      });
  }
  // Updates Only one user
  async updateUser(query: Partial<IUser>, updateQuery: Partial<IUser>): Promise<JSONResponse<Number>> {
    return await this.User.findOneAndUpdate(query, updateQuery)
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
    return await this.Template.findOneAndUpdate(query, updateQuery)
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
  async insertUser(user: IUser): Promise<JSONResponse<Number>> {
    return await this.User.create(user)
      .then(result => {
        return Promise.resolve({ success: true, result: 1 });
      })
      .catch(e => {
        return Promise.resolve({
          success: false,
          errorMessage: e
        });
      });
  }
  async insertTemplate(template: ITemplate): Promise<JSONResponse<Number>> {
    return await this.Template.create(template)
      .then(result => {
        return Promise.resolve({ success: true, result: 1 });
      })
      .catch(e => {
        return Promise.resolve({
          success: false,
          errorMessage: e
        });
      });
  }
  async removeUser(query: Partial<IUser>): Promise<JSONResponse<Number>> {
    return await this.User.deleteOne(query)
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
    return await this.Template.deleteOne(query)
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

  // Set up mongoose models to work with the chosen collections
  async setUpCollections(): Promise<JSONResponse<Boolean>> {
    try {
      this.User = Mongo.Model.getCollection<IUserModel>(this.db, USERS_COLLECTION_NAME_SINGULAR, UserSchema);
      this.Template = Mongo.Model.getCollection<ITemplateModel>(this.db, TEMPLATES_COLLECTION_NAME_SINGULAR, TemplateSchema);
      return Promise.resolve({ success: true });
    } catch (e) {
      return Promise.resolve({ success: false, errorMessage: e });
    }
  }

  async initializeDB(): Promise<JSONResponse<Boolean>> {
    return await mongoose
      .createConnection(this.connectionString, this.options)
      .then(connection => {
        this.db = connection;
        return this.setUpCollections();
      })
      .catch(e => {
        return Promise.resolve({ success: false, errorMessage: e });
      });
  }

  async connect(): Promise<JSONResponse<Boolean>> {
    return await this.initializeDB();
  }

  async close(): Promise<JSONResponse<Boolean>> {
    return await this.db
      .close()
      .then(result => {
        return Promise.resolve({ success: true });
      })
      .catch(e => {
        return Promise.resolve({ success: false, errorMessage: e });
      });
  }
}
