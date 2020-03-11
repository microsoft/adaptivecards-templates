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
  FAILURE_UPDATE_CURRENT_TEMPLATE_VERSION,
  RECEIVE_UPDATE_CURRENT_TEMPLATE_VERSION,
  REQUEST_UPDATE_CURRENT_TEMPLATE_VERSION,
  GET_TEMPLATE,
  GET_TEMPLATE_SUCCESS,
  GET_TEMPLATE_FAILURE
} from './types';

const initialState: CurrentTemplateState = {
  templateID: undefined,
  templateJSON: undefined,
  templateName: undefined,
  sampleDataJSON: undefined,
  version: undefined,
  isFetching: false
};

export function currentTemplateReducer(state = initialState, action: CurrentTemplateAction): CurrentTemplateState {
  switch (action.type) {
    case NEW_TEMPLATE:
      return {
        ...state,
        templateID: "",
        templateJSON: require('../../assets/default-adaptivecards/defaultAdaptiveCard.json'),
        templateName: "Untitled",
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
    case GET_TEMPLATE_SUCCESS:
      return {
        ...state,
        template: action.template,
        templateJSON: action.templateJSON,
        templateName: action.templateName,
        sampleDataJSON: action.sampleDataJSON,
        version: action.version,
        isFetching: false,
      }
    case GET_TEMPLATE_FAILURE:
      return {
        ...state,
        templateID: undefined,
        isFetching: false,
      }
    default:
      return state;
  }
}
