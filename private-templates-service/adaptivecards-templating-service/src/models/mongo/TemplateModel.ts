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
		instances: { type: [TemplateInstanceSchema], required: true, default: [TemplateInstanceSchema] },
		tags: { type: [String], default: [String] },
		owner: { type: String, required: true }, // todo: add ref: "User" so it checks if owner exists and make type ObjectID
		isPublished: { type: String, required: true }
	},
	{
		versionKey: false,
		timestamps: { createdAt: true, updatedAt: true }
	}
);
