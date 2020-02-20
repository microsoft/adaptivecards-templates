import { CurrentTemplateState, CurrentTemplateAction, REQUEST_NEW_TEMPLATE_UPDATE, FAILURE_NEW_TEMPLATE_UPDATE, RECEIVE_NEW_TEMPLATE_UPDATE, REQUEST_EXISTING_TEMPLATE_UPDATE, FAILURE_EXISTING_TEMPLATE_UPDATE, NEW_TEMPLATE, RECEIVE_EXISTING_TEMPLATE_UPDATE } from "./types";

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