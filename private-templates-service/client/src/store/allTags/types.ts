import { IncomingMessage } from "http";
import { TagList } from "adaptive-templating-service-typescript-node";

export interface AllTagsState {
  isFetching: boolean;
  tags?: TagList;
}

//Action Types
export const REQUEST_TAGS_GET = "REQUEST_TAGS_GET";
export const REQUEST_TAGS_GET_SUCCESS = "REQUEST_TAGS_GET_SUCCESS";
export const REQUEST_TAGS_GET_FAIL = "REQUEST_TAGS_GET_FAIL";

//Actions
export interface AllTagsAction {
  type: typeof REQUEST_TAGS_GET | typeof REQUEST_TAGS_GET_SUCCESS | typeof REQUEST_TAGS_GET_FAIL;
  tags?: TagList;
  error?: IncomingMessage;
}
