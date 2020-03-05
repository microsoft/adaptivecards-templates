// Base class for all the StorageProviders.
import { JSONResponse, IUser, ITemplate, SortBy, SortOrder, ITemplateInstance } from "../models/models";

// T - type of connection parameter required
export interface StorageProvider {
  // If no users found - result of the response must be set to false
  // If no templates found - result of the response must be set to false
  // TODO: Implement OR by tags or name
  getUsers(query: Partial<IUser>): Promise<JSONResponse<IUser[]>>;
  getTemplates(query: Partial<ITemplate>, sortBy?: SortBy, sortOrder?: SortOrder): Promise<JSONResponse<ITemplate[]>>;
  updateUser(query: Partial<IUser>, updateQuery: Partial<IUser>): Promise<JSONResponse<Number>>;
  updateTemplate(query: Partial<ITemplate>, updateQuery: Partial<ITemplate>): Promise<JSONResponse<Number>>;
  insertUser(user: IUser): Promise<JSONResponse<string>>;
  insertTemplate(template: ITemplate): Promise<JSONResponse<string>>;
  removeUser(query: Partial<IUser>): Promise<JSONResponse<Number>>;
  removeTemplate(query: Partial<ITemplate>): Promise<JSONResponse<Number>>;
  // removeTemplateVersions(templateQuery: Partial<ITemplate>, versionQuery: Partial<ITemplateInstance>): Promise<JSONResponse<Number[]>>;
  // Params are optional and don't have to be provided at connection time.
  // They can be provided in the constructor.
  connect<T>(params?: T): Promise<JSONResponse<Boolean>>;
  close(): Promise<JSONResponse<Boolean>>;
}
