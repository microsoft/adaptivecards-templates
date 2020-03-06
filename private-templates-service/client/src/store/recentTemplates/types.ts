import { IncomingMessage } from "http";
import { TemplateList } from "adaptive-templating-service-typescript-node";

export const REQUEST_RECENT_TEMPLATES_GET = "REQUEST_USER_GET";
export const REQUEST_RECENT_TEMPLATES_GET_SUCCESS = "REQUEST_USER_GET_SUCCESS";
export const REQUEST_RECENT_TEMPLATES_GET_FAIL = "REQUEST_USER_GET_FAIL";

export interface RecentTemplatesState {
  isFetching: boolean;
  recentlyEdited?: TemplateList;
  recentlyViewed?: TemplateList;
}

export interface RecentTemplatesAction {
  type:
    | typeof REQUEST_RECENT_TEMPLATES_GET
    | typeof REQUEST_RECENT_TEMPLATES_GET_SUCCESS
    | typeof REQUEST_RECENT_TEMPLATES_GET_FAIL;
  recentlyEdited?: TemplateList;
  recentlyViewed?: TemplateList;
  error?: IncomingMessage;
}
