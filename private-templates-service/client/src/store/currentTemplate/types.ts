import { Template } from 'adaptive-templating-service-typescript-node';

import { IncomingMessage } from "http";

export interface CurrentTemplateState {
  templateID?: string;
  templateJSON?: string;
  templateName?: string;
  sampleDataJSON?: string;
  template?: Template;
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

export const GET_TEMPLATE = 'GET_TEMPLATE';
export const GET_TEMPLATE_SUCCESS = 'GET_TEMPLATE_SUCCESS';
export const GET_TEMPLATE_FAILURE = 'GET_TEMPLATE_FAILURE';

export type CurrentTemplateActionTypes = typeof NEW_TEMPLATE |
  typeof REQUEST_NEW_TEMPLATE_UPDATE |
  typeof RECEIVE_NEW_TEMPLATE_UPDATE |
  typeof FAILURE_NEW_TEMPLATE_UPDATE |
  typeof REQUEST_EXISTING_TEMPLATE_UPDATE |
  typeof RECEIVE_EXISTING_TEMPLATE_UPDATE |
  typeof FAILURE_EXISTING_TEMPLATE_UPDATE |
  typeof GET_TEMPLATE |
  typeof GET_TEMPLATE_SUCCESS |
  typeof GET_TEMPLATE_FAILURE;

export interface CurrentTemplateAction {
  type: CurrentTemplateActionTypes;
  text: string;
  templateID?: string;
  templateJSON?: string;
  templateName?: string;
  sampleDataJSON?: string;
  template?: Template;
  error?: IncomingMessage;
}
