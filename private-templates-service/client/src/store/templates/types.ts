import { IncomingMessage } from "http";
import { TemplateList } from "adaptive-templating-service-typescript-node";

export interface AllTemplateState {
  isFetching: boolean;
  templates?: TemplateList;
}

//Action Types
export const REQUEST_TEMPLATES_GET = "REQUEST_TEMPLATES_GET";
export const REQUEST_TEMPLATE_GET_SUCCESS = "REQUEST_TEMPLATE_GET_SUCCESS";
export const REQUEST_TEMPLATE_GET_FAIL = "REQUEST_TEMPLATE_GET_FAIL";

//Actions
export interface AllTemplateAction {
  type: typeof REQUEST_TEMPLATES_GET | typeof REQUEST_TEMPLATE_GET_SUCCESS | typeof REQUEST_TEMPLATE_GET_FAIL;
  cards?: TemplateList;
  error?: IncomingMessage;
}
