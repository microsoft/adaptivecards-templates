import { TemplateState, TemplateAction, REQUEST_TEMPLATES, RECEIVE_TEMPLATES, FAIL_GET } from "./types";
import { TemplateList } from "adaptive-templating-service-typescript-node";

const initialState: TemplateState = {
  fetching: false,
  templates: TemplateList,
}

export function templateReducer(state = initialState, action: TemplateAction): TemplateState {
  switch (action.type) {
    case REQUEST_TEMPLATES:
      return {
        ...state,
        fetching: true,
      }
    case RECEIVE_TEMPLATES:
      return {
        ...state,
        fetching: false,
        templates: action.cards
      }
    case FAIL_GET:
      return {
        ...state,
        fetching: false,
        templates: TemplateList
      }
    default:
      return state;
  }
}