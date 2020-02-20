import { AllTemplatesState, AllTemplateAction, REQUEST_TEMPLATES_GET, REQUEST_TEMPLATE_GET_SUCCESS, REQUEST_TEMPLATE_GET_FAIL } from "./types";
import { TemplateList } from "adaptive-templating-service-typescript-node";

const initialState: AllTemplatesState = {
  isFetching: false,
  templateList: new TemplateList(),
}

export function allTemplateReducer(state = initialState, action: AllTemplateAction): AllTemplatesState {
  switch (action.type) {
    case REQUEST_TEMPLATES_GET:
      return {
        ...state,
        isFetching: true,
      }
    case REQUEST_TEMPLATE_GET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        templateList: action.cards
      }
    case REQUEST_TEMPLATE_GET_FAIL:
      return {
        ...state,
        isFetching: false,
        templateList: new TemplateList()
      }
    default:
      return state;
  }
}
