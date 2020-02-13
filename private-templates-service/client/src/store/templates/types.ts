import { IncomingMessage } from "http";
import { TemplateList } from "adaptive-templating-service-typescript-node";

export interface TemplateState {
  fetching: boolean;
  templates: any;
}

//Action Types
export const REQUEST_TEMPLATES = 'REQUEST_TEMPLATES';
export const RECEIVE_TEMPLATES = 'RECEIVE_TEMPLATES';
export const FAIL_GET = 'FAIL_GET';

//Actions
export interface TemplateAction {
  type: typeof REQUEST_TEMPLATES | typeof RECEIVE_TEMPLATES | typeof FAIL_GET;
  cards?: TemplateList,
  error?: IncomingMessage,
}