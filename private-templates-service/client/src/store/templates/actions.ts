import { REQUEST_TEMPLATES_GET, REQUEST_TEMPLATE_GET_SUCCESS, REQUEST_TEMPLATE_GET_FAIL, AllTemplateAction } from "./types";
import { TemplateList } from 'adaptive-templating-service-typescript-node';
import { IncomingMessage } from "http";
import { RootState } from "../rootReducer";
import { initClientSDK } from "../../utils/TemplateUtil";

export function requestAllTemplates(): AllTemplateAction {
  return {
    type: REQUEST_TEMPLATES_GET
  }
}

export function receiveAllTemplates(templates: TemplateList): AllTemplateAction {
  return {
    type: REQUEST_TEMPLATE_GET_SUCCESS,
    cards: templates
  }
}

export function failGetAll(error: IncomingMessage): AllTemplateAction {
  return {
    type: REQUEST_TEMPLATE_GET_FAIL,
    error: error
  }
}

export function getAllTemplates(tags?: string[]) {
  return function (dispatch: any, getState: () => RootState) {
    dispatch(requestAllTemplates())
    const api = initClientSDK(dispatch, getState);
    return api.allTemplates(undefined, true, undefined, undefined, undefined, undefined, undefined, tags)
      .then(response => {
        if (response.response.statusCode && response.response.statusCode === 200) {
          dispatch(receiveAllTemplates(response.body))
        } else {
          dispatch(failGetAll(response.response))
        }
      })
  }
}
