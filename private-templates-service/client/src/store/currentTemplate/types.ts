import { IncomingMessage } from "http";

export interface CurrentTemplateState {
  templateID: string | undefined;
  templateJSON: string | undefined;
  templateName: string | undefined;
  sampleDataJSON: string | undefined;
  isFetching: boolean;
}

//Action Types
export const NEW_TEMPLATE = 'NEW_TEMPLATE';
export const REQUEST_NEW_TEMPLATE_UPDATE = 'REQUEST_NEW_TEMPLATE_UPDATE';
export const RECEIVE_NEW_TEMPLATE_UPDATE = 'RECEIVE_NEW_TEMPLATE_UPDATE';
export const FAILURE_NEW_TEMPLATE_UPDATE = 'FAILURE_NEW_TEMPLATE_UPDATE';
export const REQUEST_EXISTING_TEMPLATE_UPDATE = 'REQUEST_EXISTING_TEMPLATE_UPDATE';
export const RECEIVE_EXISTING_TEMPLATE_UPDATE = 'RECEIVE_EXISTING_TEMPLATE_UPDATE';
export const FAILURE_EXISTING_TEMPLATE_UPDATE = 'FAILURE_EXISTING_TEMPLATE_UPDATE';

export interface CurrentTemplateAction {
  actionType: typeof NEW_TEMPLATE |
  typeof REQUEST_NEW_TEMPLATE_UPDATE |
  typeof RECEIVE_NEW_TEMPLATE_UPDATE |
  typeof FAILURE_NEW_TEMPLATE_UPDATE |
  typeof REQUEST_EXISTING_TEMPLATE_UPDATE |
  typeof RECEIVE_EXISTING_TEMPLATE_UPDATE |
  typeof FAILURE_EXISTING_TEMPLATE_UPDATE;
  text: string;
  templateID?: string;
  templateJSON?: string;
  templateName?: string;
  sampleDataJSON?: string;
  error?: IncomingMessage;
}