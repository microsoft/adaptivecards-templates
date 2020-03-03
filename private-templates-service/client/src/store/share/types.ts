import { IncomingMessage } from "http";

export interface ShareTemplateState {
  isFetching: boolean;
}

export const REQUEST_SEND_EMAIL = 'REQUEST_SEND_EMAIL';
export const RECEIVE_SEND_EMAIL = 'RECEIVE_SEND_EMAIL';
export const FAILURE_SEND_EMAIL = 'FAILURE_SEND_EMAIL';

export interface ShareTemplateAction {
  type: typeof REQUEST_SEND_EMAIL |
  typeof RECEIVE_SEND_EMAIL |
  typeof FAILURE_SEND_EMAIL;
  text: string;
  error?: IncomingMessage;
}