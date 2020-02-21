/**
 * @interface
 * User model
 * @property {string} _id - unique identifier
 * @property {string} authId - unique id given by auth provider in access token
 * @property {string} issuer - one of the value in Issuer, both authId and issuer can identify the id
 * @property {string[]} team
 * @property {string[]} org
 */

export interface ITemplateInstance {
  _id?: string;
  json: string;
  version: string;
  publishedAt?: Date;
  state?: TemplateState;
  isShareable?: boolean;
  numHits?: number;
  data?: string;
  updatedAt?: Date;
  createdAt?: Date;
}

export interface ITemplate {
  _id?: string;
  name: string;
  owner: string;
  instances?: ITemplateInstance[];
  tags?: string[];
  deletedVersions?: string[];
  isLive?: boolean; // at least one version is published
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser {
  _id?: string;
  issuer: string;
  authId: string;
  firstName?: string;
  lastName?: string;
  team?: string[];
  org?: string[];
  recentlyViewedTemplates?: string[]; // size 5
  recentlyEditedTemplates?: string[]; // max size 5
  recentTags?: string[]; // max size 10
}

export interface JSONResponse<T> {
  success: boolean;
  errorMessage?: string;
  result?: T;
}

export enum TemplateState {
  draft = "draft",
  live = "live",
  deprecated = "deprecated"
}

export enum SortBy {
  dateCreated = "createdAt",
  dateModified = "updatedAt",
  alphabetical = "name"
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
