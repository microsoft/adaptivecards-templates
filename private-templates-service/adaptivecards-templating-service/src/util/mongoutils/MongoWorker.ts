import { JSONResponse } from "../../models/models";
import { ITemplateModel, TemplateSchema } from "../../models/mongo/TemplateModel";
import { IUserModel, UserSchema } from "../../models/mongo/UserModel";
import { MongoUtils } from "./mongoutils";
import { MongoConnectionParams, mongoDefaultConnectionOptions, mongoDefaultConnectionString } from "../../models/mongo/MongoConnectionParams";
import mongoose from "mongoose";

const USERS_COLLECTION_NAME_SINGULAR: string = "User";
const TEMPLATES_COLLECTION_NAME_SINGULAR: string = "Template";

export class MongoWorker {
  connectionString: string;
  options: any;
  db!: mongoose.Connection;
  Template!: mongoose.Model<ITemplateModel>;
  User!: mongoose.Model<IUserModel>;
  constructor(connectionParams: MongoConnectionParams) {
    this.connectionString = connectionParams.connectionString ? connectionParams.connectionString : mongoDefaultConnectionString;
    this.options = connectionParams.options ? connectionParams.options : mongoDefaultConnectionOptions;
  }

  async setUpCollections(): Promise<JSONResponse<Boolean>> {
    try {
      this.User = MongoUtils.getCollection<IUserModel>(this.db, USERS_COLLECTION_NAME_SINGULAR, UserSchema);
      this.Template = MongoUtils.getCollection<ITemplateModel>(this.db, TEMPLATES_COLLECTION_NAME_SINGULAR, TemplateSchema);
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
