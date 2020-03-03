import { IncomingMessage } from "http";
import { TemplateList } from "adaptive-templating-service-typescript-node";

export enum RecentTemplatesActionsTypes {
  REQUEST_RECENT_TEMPLATES_GET = "REQUEST_USER_GET",
  REQUEST_RECENT_TEMPLATES_GET_SUCCESS = "REQUEST_USER_GET_SUCCESS",
  REQUEST_RECENT_TEMPLATES_GET_FAIL = "REQUEST_USER_GET_FAIL"
}

export interface RecentTemplatesState {
  isFetching: boolean;
  recentlyEdited?: TemplateList;
  recentlyViewed?: TemplateList;
}

export interface RecentTemplatesAction {
  type: RecentTemplatesActionsTypes;
  recentlyEdited?: TemplateList;
  recentlyViewed?: TemplateList;
  error?: IncomingMessage;
}
