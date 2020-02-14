import { AllTemplateState, AllTemplateAction, REQUEST_TEMPLATES_GET, REQUEST_TEMPLATE_GET_SUCCESS, REQUEST_TEMPLATE_GET_FAIL } from "./types";
import { TemplateList } from "adaptive-templating-service-typescript-node";
import { ActionsConfig } from "adaptivecards";

const initialState: AllTemplateState = {
  fetching: false,
  templates: new TemplateList(),
}

export function allTemplateReducer(state = initialState, action: AllTemplateAction): AllTemplateState {
  switch (action.type) {
    case REQUEST_TEMPLATES_GET:
      return {
        ...state,
        fetching: true,
      }
    case REQUEST_TEMPLATE_GET_SUCCESS:
      return {
        ...state,
        fetching: false,
        templates: action.cards
      }
    case REQUEST_TEMPLATE_GET_FAIL:
      return {
        ...state,
        fetching: false,
        templates: new TemplateList()
      }
    default:
      return state;
  }
}
