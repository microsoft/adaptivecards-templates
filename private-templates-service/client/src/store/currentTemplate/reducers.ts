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
  REQUEST_EXISTING_TEMPLATE_UPDATE_TAGS,
  RECIEVE_EXISTING_TEMPLATE_UPDATE_TAGS,
  FAILURE_EXISTING_TEMPLATE_UPDATE_TAGS,
  FAILURE_UPDATE_CURRENT_TEMPLATE_VERSION,
  RECEIVE_UPDATE_CURRENT_TEMPLATE_VERSION,
  REQUEST_UPDATE_CURRENT_TEMPLATE_VERSION,
  GET_TEMPLATE,
  GET_TEMPLATE_TAGS,
  GET_TEMPLATE_SUCCESS,
  GET_TEMPLATE_FAILURE,
  DELETE_TEMPLATE_INSTANCE,
  DELETE_TEMPLATE_INSTANCE_SUCCESS,
  DELETE_TEMPLATE_INSTANCE_FAILURE,
} from './types';

import { NEW_TEMPLATE_NAME } from '../../assets/strings';

const initialState: CurrentTemplateState = {
  templateID: undefined,
  templateJSON: undefined,
  templateName: undefined,
  sampleDataJSON: undefined,
  version: undefined,
  isFetching: false,
  isFetchingTags: false,
};

export function currentTemplateReducer(state = initialState, action: CurrentTemplateAction): CurrentTemplateState {
  switch (action.type) {
    case NEW_TEMPLATE:
      return {
        ...state,
        template: undefined,
        templateID: "",
        templateJSON: require('../../assets/default-adaptivecards/defaultAdaptiveCard.json'),
        templateName: NEW_TEMPLATE_NAME,
        sampleDataJSON: {},
        version: "",
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
        version: action.version,
        isFetching: false
      };
    case REQUEST_EXISTING_TEMPLATE_UPDATE_TAGS:
      return {
        ...state,
        isFetchingTags: true
      };
    case RECIEVE_EXISTING_TEMPLATE_UPDATE_TAGS:
    case FAILURE_EXISTING_TEMPLATE_UPDATE_TAGS:
      return {
        ...state,
        isFetchingTags: false
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
        version: action.version,
        isFetching: false
      };
    case FAILURE_UPDATE_CURRENT_TEMPLATE_VERSION:
      return {
        ...state,
      }
    case REQUEST_UPDATE_CURRENT_TEMPLATE_VERSION:
      return {
        ...state,
        isFetching: false
      }
    case RECEIVE_UPDATE_CURRENT_TEMPLATE_VERSION:
      return {
        ...state,
        templateJSON: action.templateJSON,
        sampleDataJSON: action.sampleDataJSON,
        version: action.version
      }
    case GET_TEMPLATE:
      return {
        ...state,
        templateID: action.templateID,
        templateJSON: undefined,
        templateName: undefined,
        sampleDataJSON: undefined,
        version: undefined,
        isFetching: true,
      }
    case GET_TEMPLATE_TAGS:
      return {
        ...state,
        isFetchingTags: true,
      }
    case GET_TEMPLATE_SUCCESS:
      return {
        ...state,
        template: action.template,
        templateJSON: action.templateJSON,
        templateName: action.templateName,
        sampleDataJSON: action.sampleDataJSON,
        version: action.version,
        isFetching: false,
        isFetchingTags: false,
      }
    case GET_TEMPLATE_FAILURE:
      return {
        ...state,
        templateID: undefined,
        isFetching: false,
        isFetchingTags: false,
      }
    case DELETE_TEMPLATE_INSTANCE:
      return {
        ...state,
        isFetching: true
      }
    case DELETE_TEMPLATE_INSTANCE_SUCCESS:
      return {
        ...state,
        template: action.template,
        isFetching: false
      }
    case DELETE_TEMPLATE_INSTANCE_FAILURE:
      return {
        ...state,
        isFetching: false
      }
    default:
      return state;
  }
}
