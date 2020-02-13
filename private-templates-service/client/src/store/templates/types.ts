import { IncomingMessage } from "http";
import { TemplateList } from "adaptive-templating-service-typescript-node";

export interface TemplateState {
  fetching: boolean;
  templates: any;
}

//Action Types
export const REQUEST_TEMPLATES_GET = 'REQUEST_TEMPLATES_GET';
export const REQUEST_TEMPLATE_GET_SUCCES = 'REQUEST_TEMPLATE_GET_SUCCES';
export const REQUEST_TEMPLATE_GET_FAIL = 'REQUEST_TEMPLATE_GET_FAIL';

//Actions
export interface TemplateAction {
  type: typeof REQUEST_TEMPLATES_GET | typeof REQUEST_TEMPLATE_GET_SUCCES | typeof REQUEST_TEMPLATE_GET_FAIL;
  cards?: TemplateList,
  error?: IncomingMessage,
}