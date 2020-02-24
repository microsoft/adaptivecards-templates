import mongoose, { Schema } from "mongoose";
import { ITemplate, ITemplateInstance, TemplateState } from "../models";
import { MongoUtils } from "../../util/mongoutils/mongoutils";

export interface ITemplateInstanceModel extends mongoose.Document, ITemplateInstance {
  _id: string;
}
export interface ITemplateModel extends mongoose.Document, ITemplate {
  _id: string;
  instances: ITemplateInstanceModel[];
}

export const TemplateInstanceSchema: Schema = new Schema(
  {
    _id: { type: String, required: true },
    json: { type: String, required: true },
    version: { type: String, required: true },
    publishedAt: { type: Date, default: null },
    state: { type: String, default: TemplateState.draft },
    isShareable: { type: Boolean, default: false },
    hits: { type: Number, default: 0 },
    data: { type: [String], default: [] }
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true }
  }
);
export const TemplateSchema: Schema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    owner: { type: String, required: true }, // todo: add ref: "User" so it checks if owner exists and make type ObjectID
    instances: { type: [TemplateInstanceSchema], default: [] },
    tags: { type: [String], default: [] },
    deletedVersions: { type: [String], default: [] },
    isLive: { type: Boolean, default: false }
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

TemplateSchema.pre("validate", function(next) {
  this._id = MongoUtils.generateUniqueID().toHexString();
  next();
});

TemplateSchema.index({ createdAt: 1 });
TemplateSchema.index({ updatedAt: 1 });
TemplateSchema.index({ name: 1 });
