import mongoose, { Schema, SchemaTypes } from "mongoose";
// import { IUser } from "../../providers/StorageProvider";
import { ITemplate, ITemplateInstance } from "../models";

export interface ITemplateInstanceModel extends mongoose.Document, ITemplateInstance {}
export interface ITemplateModel extends mongoose.Document, ITemplate {
  id: string;
  instances: ITemplateInstanceModel[];
}

export const TemplateInstanceSchema: Schema = new Schema(
  {
    json: { type: Object, required: true },
    version: { type: String, required: true }
  },
  {
    versionKey: false,
    timestamps: false
  }
);

export const TemplateSchema: Schema = new Schema(
  {
    instances: { type: [TemplateInstanceSchema], required: true, default: [TemplateInstanceSchema] },
    tags: { type: [String], default: [String] },
    owner: { type: Schema.Types.String, required: true }, // add ref: "User" so it checks if owner exists and make type ObjectID
    isPublished: { type: Schema.Types.Boolean, required: true }

    // permissions
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true }
  }
);
