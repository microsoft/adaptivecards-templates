import { CurrentTemplateState } from "./types";
import { CurrentTemplateAction } from './types';
import { NEW_TEMPLATE } from './types';
import { REQUEST_NEW_TEMPLATE_UPDATE } from './types';
import { REQUEST_EXISTING_TEMPLATE_UPDATE } from './types';
import { RECEIVE_NEW_TEMPLATE_UPDATE } from './types';
import { RECEIVE_EXISTING_TEMPLATE_UPDATE } from './types';
import { FAILURE_NEW_TEMPLATE_UPDATE } from './types';
import { FAILURE_EXISTING_TEMPLATE_UPDATE } from './types';

const initialState: CurrentTemplateState = {
  templateID: undefined,
  templateJSON: undefined,
  templateName: undefined,
  sampleDataJSON: undefined,
  isFetching: false
};

export function currentTemplateReducer(state = initialState, action: CurrentTemplateAction): CurrentTemplateState {
  switch (action.type) {
    case NEW_TEMPLATE:
      return {
        ...state,
        templateID: "",
        templateJSON: JSON.stringify(require('../../assets/default-adaptivecards/defaultAdaptiveCard.json')),
        templateName: "Untitled",
        sampleDataJSON: "",
        isFetching: false
      };
    case REQUEST_NEW_TEMPLATE_UPDATE:
      return {
        ...state,
        isFetching: true
      };
    case FAILURE_NEW_TEMPLATE_UPDATE:
      return {
        ...state,
        isFetching: false
      };
    case RECEIVE_NEW_TEMPLATE_UPDATE:
      return {
        ...state,
        templateID: action.templateID,
        templateJSON: action.templateJSON,
        templateName: action.templateName,
        sampleDataJSON: action.sampleDataJSON,
        isFetching: false
      };
    case REQUEST_EXISTING_TEMPLATE_UPDATE:
      return {
        ...state,
        isFetching: true
      };
    case FAILURE_EXISTING_TEMPLATE_UPDATE:
      return {
        ...state,
        isFetching: false
      };
    case RECEIVE_EXISTING_TEMPLATE_UPDATE:
      return {
        ...state,
        templateJSON: action.templateJSON,
        templateName: action.templateName,
        sampleDataJSON: action.sampleDataJSON,
        isFetching: false
      };
    default:
      return state;
  }
}