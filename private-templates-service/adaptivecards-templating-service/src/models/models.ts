/**
 * @interface
 * User model
 * @property {string} _id - unique identifier
 * @property {string} authId - unique id given by auth provider in access token
 * @property {string} issuer - one of the value in Issuer, both authId and issuer can identify the id
 * @property {string[]} team
 * @property {string[]} org
 */
export interface IUser {
  _id?: string;
  authId: string;
  issuer: string;
  team?: string[];
  org?: string[];
}

export interface ITemplateInstance {
  json: string;
  version: string;
}

export interface ITemplate {
  _id?: string;
  name: string;
  instances: ITemplateInstance[];
  tags?: string[];
  owner?: string;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
  isPublished?: boolean;
  isShareable?: boolean;
}

export interface JSONResponse<T> {
  success: boolean;
  errorMessage?: string;
  result?: T;
}

export enum SortBy {
  dateCreated = "createdAt",
  dateModified = "updatedAt",
  alphabetical = "alphabetical"
}

export enum SortOrder {
  ascending = 1,
  descending = -1
}

/**
 * @enum
 * Access token issuer types.
 */
export enum Issuer {
  AzureAD = "AzureAD"
}
