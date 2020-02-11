export interface IUser {
  _id?: string;
  team: string[];
  org: string[];
  email: string;
}

export interface ITemplateInstance {
  json: string;
  version: string;
}

export interface ITemplate {
  _id?: string;
  instances: ITemplateInstance[];
  tags: string[];
  owner: string;
  createdAt?: Date;
  updatedAt?: Date;
  isPublished?: boolean;
}

export interface JSONResponse<T> {
  success: boolean;
  errorMessage?: string;
  result?: T;
}
