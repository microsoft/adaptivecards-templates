import {
  CurrentTemplateAction,
  CurrentTemplateState,
  NEW_TEMPLATE,
  REQUEST_NEW_TEMPLATE_UPDATE,
  RECEIVE_NEW_TEMPLATE_UPDATE,
  FAILURE_NEW_TEMPLATE_UPDATE,
  REQUEST_EXISTING_TEMPLATE_UPDATE,
  RECEIVE_EXISTING_TEMPLATE_UPDATE,
  FAILURE_EXISTING_TEMPLATE_UPDATE,
  GET_TEMPLATE,
  GET_TEMPLATE_SUCCESS,
  GET_TEMPLATE_FAILURE,
  DELETE_TEMPLATE,
  DELETE_TEMPLATE_SUCCESS,
  DELETE_TEMPLATE_FAILURE
} from './types';

import { Template } from 'adaptive-templating-service-typescript-node';

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
    case GET_TEMPLATE:
      return {
        ...state,
        templateID: action.templateID,
        template: undefined,
        templateJSON: undefined,
        templateName: undefined,
        sampleDataJSON: undefined,
        isFetching: true,
      }
    case GET_TEMPLATE_SUCCESS:
      return {
        ...state,
        template: action.template,
        templateJSON: action.templateJSON,
        templateName: action.templateName,
        sampleDataJSON: action.sampleDataJSON,
        isFetching: false,
      }
    case GET_TEMPLATE_FAILURE:
      return {
        ...state,
        templateID: undefined,
        isFetching: false,
      }
    case DELETE_TEMPLATE: 
      return {
        ...state,
        isFetching: true
      }
    case DELETE_TEMPLATE_SUCCESS:
      return {
        ...state, 
        template: action.template,
        isFetching: false
      }
    case DELETE_TEMPLATE_FAILURE: 
      return {
        ...state, 
        isFetching: false
      }
    default:
      return state;
  }
}
