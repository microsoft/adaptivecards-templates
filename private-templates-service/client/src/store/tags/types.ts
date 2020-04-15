import { IncomingMessage } from "http";
import { TagList } from "adaptive-templating-service-typescript-node";

export interface TagsState {
  isFetching: boolean;
  allTags?: TagList;
  selectedTags: string[];
}

//Action Types
export const REQUEST_ALL_TAGS_GET = "REQUEST_ALL_TAGS_GET";
export const REQUEST_ALL_TAGS_GET_SUCCESS = "REQUEST_ALL_TAGS_GET_SUCCESS";
export const REQUEST_ALL_TAGS_GET_FAIL = "REQUEST_ALL_TAGS_GET_FAIL";
export const ADD_SELECTED_TAG = "ADD_SELECTED_TAG";
export const REMOVE_SELECTED_TAG = "REMOVE_SELECTED_TAG";
export const CLEAR_SELECTED_TAGS = "CLEAR_SELECTED_TAGS";

//Actions
export interface TagsAction {
  type: typeof REQUEST_ALL_TAGS_GET | typeof REQUEST_ALL_TAGS_GET_SUCCESS | typeof REQUEST_ALL_TAGS_GET_FAIL | typeof ADD_SELECTED_TAG | typeof REMOVE_SELECTED_TAG | typeof CLEAR_SELECTED_TAGS;
  allTags?: TagList;
  tag?: string;
  error?: IncomingMessage;
}
