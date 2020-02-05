// Base class for all the StorageProviders.
import { UserQuery, TemplateQuery, JSONResponse, IUser, ITemplate, ITemplateInstance } from "./models";
export interface StorageProvider {
  getUser(query: UserQuery): Promise<IUser[]>;
  getTemplate(query: TemplateQuery): Promise<ITemplate[]>;
  updateUser(query: UserQuery, updateQuery: UserQuery): Promise<JSONResponse<Number>>;
  updateTemplate(query: TemplateQuery, updateQuery: TemplateQuery): Promise<JSONResponse<Number>>;
  insertUser(user: IUser): Promise<void>;
  insertTemplate(user: ITemplate): Promise<void>;
  removeUser(query: UserQuery): Promise<JSONResponse<Number>>;
  removeTemplate(query: TemplateQuery): Promise<JSONResponse<Number>>;
}
