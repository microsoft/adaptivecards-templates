import { TemplateState, TemplateAction, REQUEST_TEMPLATES_GET, REQUEST_TEMPLATE_GET_SUCCES, REQUEST_TEMPLATE_GET_FAIL } from "./types";
import { TemplateList } from "adaptive-templating-service-typescript-node";
import { ActionsConfig } from "adaptivecards";

const initialState: TemplateState = {
  fetching: false,
  templates: new TemplateList(),
}

export function templateReducer(state = initialState, action: TemplateAction): TemplateState {
  switch (action.type) {
    case REQUEST_TEMPLATES_GET:
      return {
        ...state,
        fetching: true,
      }
    case REQUEST_TEMPLATE_GET_SUCCES:
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
