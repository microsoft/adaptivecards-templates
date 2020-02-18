import mongoose, { Schema } from "mongoose";
import { IUser } from "../models";
import { MongoUtils } from "../../util/mongoutils/mongoutils";

// _id instead of id because mongo uses _id for the unique key
// and it cannot be changed. The only solution is to rename
// field id to _id when building queries.
// Another alternative is to define another unique key but
// then again _id will still be there and we'll end up
// with two different unique keys. Let me know if you
// have any other suggestions
export interface IUserModel extends mongoose.Document, IUser {
  _id: string;
}

export const UserSchema: Schema = new Schema(
  {
    _id: { type: String, required: true },
    authId: { type: String, required: true },
    issuer: { type: String, required: true },
    team: { type: [String], default: [] },
    org: { type: [String], default: [] }
  },
  {
    versionKey: false,
    timestamps: false
  }
);

UserSchema.pre("validate", function(next) {
  this._id = MongoUtils.generateUniqueID().toHexString();
  next();
});
