import { Document, Schema, Connection, Model } from "mongoose";

module Mongo {
  export module Model {
    export function getCollection<T extends Document>(db: Connection, collection: string, schema: Schema): Model<T> {
      return db.model<T>(collection, schema);
    }
  }
  export module Utils {
    // Base64 Encode
    export function encodeTemplate(template: string): string {
      return btoa(template);
    }
    // Base64 decode
    export function decodeTemplate(template: string): string {
      return atob(template);
    }
    export function objToJSON<T extends object>(obj: T): JSON {
      return JSON.parse(JSON.stringify(obj));
    }
  }
}
export { Mongo };
