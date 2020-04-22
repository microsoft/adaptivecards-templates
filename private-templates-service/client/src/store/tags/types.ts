import { IncomingMessage } from "http";
import { Tags } from "adaptive-templating-service-typescript-node";

export interface TagsState {
  isFetching: boolean;
  allTags?: Tags;
  selectedTags: string[];
}

//Action Types
export const REQUEST_ALL_TAGS_GET = "REQUEST_ALL_TAGS_GET";
export const REQUEST_ALL_TAGS_GET_SUCCESS = "REQUEST_ALL_TAGS_GET_SUCCESS";
export const REQUEST_ALL_TAGS_GET_FAIL = "REQUEST_ALL_TAGS_GET_FAIL";
export const ADD_SELECTED_TAG = "ADD_SELECTED_TAG";
export const REMOVE_SELECTED_TAG = "REMOVE_SELECTED_TAG";
export const CLEAR_SELECTED_TAGS = "CLEAR_SELECTED_TAGS";
export const REQUEST_UPDATE_FAVORITE_TAGS = "REQUEST_UPDATE_FAVORITE_TAGS";
export const REQUEST_UPDATE_FAVORITE_TAGS_SUCCESS = "REQUEST_UPDATE_FAVORITE_TAGS_SUCCESS";
export const REQUEST_UPDATE_FAVORITE_TAGS_FAIL = "REQUEST_UPDATE_FAVORITE_TAGS_FAIL ";

//Actions
export interface TagsAction {
  type: typeof REQUEST_ALL_TAGS_GET | typeof REQUEST_ALL_TAGS_GET_SUCCESS | typeof REQUEST_ALL_TAGS_GET_FAIL | typeof ADD_SELECTED_TAG | typeof REMOVE_SELECTED_TAG | typeof CLEAR_SELECTED_TAGS | typeof REQUEST_UPDATE_FAVORITE_TAGS | typeof REQUEST_UPDATE_FAVORITE_TAGS_SUCCESS | typeof REQUEST_UPDATE_FAVORITE_TAGS_FAIL;
  allTags?: Tags;
  tag?: string;
  error?: IncomingMessage;
}

export enum TagsUpdateType {
  AddFavorite,
  RemoveFavorite
}