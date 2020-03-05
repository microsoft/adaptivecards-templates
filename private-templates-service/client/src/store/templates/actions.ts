import { REQUEST_TEMPLATES_GET, REQUEST_TEMPLATE_GET_SUCCESS, REQUEST_TEMPLATE_GET_FAIL, AllTemplateAction } from "./types";
import { TemplateApi, TemplateList, Template } from 'adaptive-templating-service-typescript-node';
import { IncomingMessage } from "http";
import { RootState } from "../rootReducer";

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

export function getAllTemplates() {
  return function (dispatch: any, getState: () => RootState) {
    const appState = getState();
    dispatch(requestAllTemplates())
    let api = new TemplateApi();
    if (appState.auth.accessToken) {
      api.setApiKey(0, `Bearer ${appState.auth.accessToken!.idToken.rawIdToken}`);
    }
    return api.allTemplates(undefined, true)
      .then(response => {
        if (response.response.statusCode && response.response.statusCode == 200) {
          dispatch(receiveAllTemplates(response.body))
        } else {
          dispatch(failGetAll(response.response))
        }
      })
  }
}
