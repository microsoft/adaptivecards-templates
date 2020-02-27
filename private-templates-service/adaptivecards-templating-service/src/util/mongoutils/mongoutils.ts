import mongoose, { Document, Schema, Connection, Model } from "mongoose";
import { ITemplateModel, ITemplateInstanceModel } from "../../models/mongo/TemplateModel";

export module MongoUtils {
  export function getCollection<T extends Document>(db: Connection, collection: string, schema: Schema): Model<T> {
    return db.model<T>(collection, schema);
  }
  export function generateUniqueID(): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId();
  }
  export function removeUndefinedFields<T>(obj: T): T {
    let result: T = { ...obj };
    for (let key in result) {
      if (result[key] === undefined) {
        delete result[key];
      }
    }
    return result;
  }

  export function restoreJSONTypeOfTemplate(templateModels: ITemplateModel[]): ITemplateModel[] {
    return templateModels.map(template => {
      template.instances = template.instances.map(instance => {
        instance.json = MongoUtils.stringToJSON(Object.assign(instance.json) as string);
        if (instance.data) {
          instance.data = MongoUtils.stringArrayToJSONArray(Object.assign(instance.data) as string[]);
        }
        return instance;
      });
      return template;
    });
  }

  export function jsonToString(obj: JSON): string {
    return JSON.stringify(obj);
  }

  export function jsonArrayToString(obj: JSON[]): string[] {
    return obj.map(j => {
      return jsonToString(j);
    });
  }

  export function stringToJSON(obj: string): JSON {
    return JSON.parse(obj);
  }

  export function stringArrayToJSONArray(obj: string[]): JSON[] {
    return obj.map(j => {
      return stringToJSON(j);
    });
  }
}
