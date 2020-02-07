import mongoose, { Schema } from "mongoose";
import { IUser } from "../models";

export interface IUserModel extends mongoose.Document, IUser {
  id: string;
}

export const UserSchema: Schema = new Schema(
  {
    team: { type: [Schema.Types.String], default: [] },
    org: { type: [Schema.Types.String], default: [] },
    email: { type: Schema.Types.String, required: true, default: "" }
  },
  {
    versionKey: false, // we don't need version for user
    timestamps: false
  }
);
