// Base class for all the StorageProviders.
import { JSONResponse, IUser, ITemplate } from "../models/models";

export interface StorageProvider {
  getUser(query: Partial<IUser>): Promise<JSONResponse<IUser[]>>;

  getTemplate(query: Partial<ITemplate>): Promise<JSONResponse<ITemplate[]>>;

  updateUser(query: Partial<IUser>, updateQuery: Partial<IUser>): Promise<JSONResponse<Number>>;
  
  updateTemplate(query: Partial<ITemplate>, updateQuery: Partial<ITemplate>): Promise<JSONResponse<Number>>;
  
  insertUser(user: IUser): Promise<JSONResponse<Number>>;
  
  insertTemplate(template: ITemplate): Promise<JSONResponse<Number>>;
  
  removeUser(query: Partial<IUser>): Promise<JSONResponse<Number>>;
  
  removeTemplate(query: Partial<ITemplate>): Promise<JSONResponse<Number>>;
}