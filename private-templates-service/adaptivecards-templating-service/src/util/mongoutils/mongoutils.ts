import mongoose, { Document, Schema, Connection, Model } from "mongoose";

export module MongoUtils {
  // Base64 Encode
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
}
