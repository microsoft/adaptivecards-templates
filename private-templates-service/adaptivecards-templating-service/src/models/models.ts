/**
 * @interface
 * User model
 * @property {string} _id - unique identifier
 * @property {string} authId - unique id given by auth provider in access token
 * @property {string} issuer - one of the value in Issuer, both authId and issuer can identify the id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string[]} team
 * @property {string[]} org
 * @property {string[]} recentlyViewed - list of 5 templates that were last viewed (GET /template/{id}) by logged in user
 */

export interface ITemplateInstance {
  _id?: string;
  json: JSON;
  version: string;
  publishedAt?: Date;
  state?: TemplateState;
  author: string;
  isShareable?: boolean;
  numHits?: number;
  data?: JSON[];
  updatedAt?: Date;
  createdAt?: Date;
  lastEditedUser?: string;
}

export interface ITemplate {
  _id?: string;
  name: string;
  authors: string[];
  instances?: ITemplateInstance[];
  tags?: string[];
  deletedVersions?: string[];
  isLive?: boolean; // at least one version is published
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser {
  _id?: string;
  authIssuer: string;
  authId: string;
  recentlyViewedTemplates?: string[]; // size 5
  recentlyEditedTemplates?: string[]; // max size 5
  recentTags?: string[]; // max size 10
  favoriteTags?: string[];
}

export interface JSONResponse<T> {
  success: boolean;
  errorMessage?: string;
  result?: T;
}

export enum SortBy {
  dateCreated = "createdAt",
  dateUpdated = "updatedAt",
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
export enum AuthIssuer {
  AzureAD = "AzureAD"
}

/**
 * @enum
 * State of the template version.
 */
export enum TemplateState {
  draft = "draft",
  deprecated = "deprecated",
  live = "live"
}

export interface TemplateInstancePreview {
  version: string;
  json: JSON;
  state: string;
  author: string;
  data: JSON[];
}

/**
 * @interface
 * Template preview.
 */
export interface TemplatePreview {
  _id: string;
  name: string;
  instance: TemplateInstancePreview;
  tags: string[];
}

/**
 * @interface
 * Tags
 */
export interface TagList {
  ownedTags: any[];
  allTags: any[];
  favoriteTags: any[];
}

/**
 * @interface
 * Request for batch update operations.
 */
export interface TemplateStateRequest {
  version: string;
  state: TemplateState;
}
