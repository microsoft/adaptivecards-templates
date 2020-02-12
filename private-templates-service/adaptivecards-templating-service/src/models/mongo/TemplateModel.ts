import mongoose, { Schema } from "mongoose";
import { ITemplate, ITemplateInstance } from "../models";

export interface ITemplateInstanceModel extends mongoose.Document, ITemplateInstance {}
export interface ITemplateModel extends mongoose.Document, ITemplate {
  _id: string;
  instances: ITemplateInstanceModel[];
}

export const TemplateInstanceSchema: Schema = new Schema(
  {
    _id: { type: String, default: mongoose.Types.ObjectId() },
    json: { type: Object, required: true },
    version: { type: String, required: true }
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true }
  }
);

export const TemplateSchema: Schema = new Schema(
  {
    _id: { type: String, default: mongoose.Types.ObjectId() },
    name: { type: String, required: true },
    instances: { type: [TemplateInstanceSchema], required: true },
    tags: { type: [String], default: [] },
    owner: { type: String, default: "" }, // todo: add ref: "User" so it checks if owner exists and make type ObjectID
    isPublished: { type: String, default: false }
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true }
  }
);
