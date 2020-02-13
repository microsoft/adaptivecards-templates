import mongoose, { Schema } from "mongoose";
import { ITemplate, ITemplateInstance } from "../models";
import { MongoUtils } from "../../util/mongoutils/mongoutils";

export interface ITemplateInstanceModel extends mongoose.Document, ITemplateInstance {}
export interface ITemplateModel extends mongoose.Document, ITemplate {
  _id: string;
  instances: ITemplateInstanceModel[];
}

export const TemplateInstanceSchema: Schema = new Schema(
  {
    _id: { type: String, required: true },
    json: { type: String, required: true },
    version: { type: String, required: true }
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true }
  }
);
TemplateInstanceSchema.pre("validate", function(next) {
  this._id = MongoUtils.generateUniqueID().toHexString();
  next();
});

export const TemplateSchema: Schema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    instances: { type: [TemplateInstanceSchema], required: true },
    tags: { type: [String], default: [] },
    owner: { type: String, default: "" }, // todo: add ref: "User" so it checks if owner exists and make type ObjectID
    isPublished: { type: String, default: false },
    isShareable: { type: String, default: false }
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true }
  }
);
TemplateSchema.pre("validate", function(next) {
  this._id = MongoUtils.generateUniqueID().toHexString();
  next();
});

TemplateSchema.index({ createdAt: 1 });
TemplateSchema.index({ updatedAt: 1 });
TemplateSchema.index({ name: 1 });
