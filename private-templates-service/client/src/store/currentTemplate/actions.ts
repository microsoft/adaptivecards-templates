import {
  CurrentTemplateAction,
  NEW_TEMPLATE,
  REQUEST_NEW_TEMPLATE_UPDATE,
  RECEIVE_NEW_TEMPLATE_UPDATE,
  FAILURE_NEW_TEMPLATE_UPDATE,
  REQUEST_EXISTING_TEMPLATE_UPDATE,
  RECEIVE_EXISTING_TEMPLATE_UPDATE,
  FAILURE_EXISTING_TEMPLATE_UPDATE,
  REQUEST_UPDATE_CURRENT_TEMPLATE_VERSION,
  RECEIVE_UPDATE_CURRENT_TEMPLATE_VERSION,
  FAILURE_UPDATE_CURRENT_TEMPLATE_VERSION,
  GET_TEMPLATE,
  GET_TEMPLATE_SUCCESS,
  GET_TEMPLATE_FAILURE,
} from './types';

import { Template, TemplateApi, PostedTemplate } from "adaptive-templating-service-typescript-node";

import { IncomingMessage } from "http";
import { RootState } from '../rootReducer';
import StateBlock from 'markdown-it/lib/rules_block/state_block';
import { CombinedState } from 'redux';

export function newTemplate(): CurrentTemplateAction {
  return {
    type: NEW_TEMPLATE,
    text: "new template"
  };
}

function requestNewTemplateUpdate(): CurrentTemplateAction {
  return {
    type: REQUEST_NEW_TEMPLATE_UPDATE,
    text: "requesting post new template on save"
  };
}

function receiveNewTemplateUpdate(templateID?: string, templateJSON?: object, templateName?: string, sampleDataJSON?: object, version?: string): CurrentTemplateAction {
  return {
    type: RECEIVE_NEW_TEMPLATE_UPDATE,
    text: "receiving post new template on save",
    templateID: templateID,
    templateJSON: templateJSON,
    templateName: templateName,
    sampleDataJSON: sampleDataJSON,
    version: "1.0",
  };
}

function failureNewTemplateUpdate(): CurrentTemplateAction {
  return {
    type: FAILURE_NEW_TEMPLATE_UPDATE,
    text: "failure post new template on save"
  };
}

function requestExistingTemplateUpdate(): CurrentTemplateAction {
  return {
    type: REQUEST_EXISTING_TEMPLATE_UPDATE,
    text: "requesting post existing template on save"
  };
}

function receiveExistingTemplateUpdate(templateJSON?: object, templateName?: string, sampleDataJSON?: object, version?: string): CurrentTemplateAction {
  return {
    type: RECEIVE_EXISTING_TEMPLATE_UPDATE,
    text: "receiving post existing template on save",
    templateJSON: templateJSON,
    templateName: templateName,
    sampleDataJSON: sampleDataJSON,
    version: version,
  };
}

function failureExistingTemplateUpdate(): CurrentTemplateAction {
  return {
    type: FAILURE_EXISTING_TEMPLATE_UPDATE,
    text: "failure post existing template on save"
  };
}

function requestTemplate(templateID: string): CurrentTemplateAction {
  return {
    type: GET_TEMPLATE,
    text: "get single template",
    templateID
  }
}

function requestTemplateSuccess(template: Template, templateJSON: object, templateName: string, sampleDataJSON: object, version: string): CurrentTemplateAction {
  return {
    type: GET_TEMPLATE_SUCCESS,
    text: "get single template success",
    template,
    templateJSON,
    templateName,
    sampleDataJSON,
    version
  }
}

function requestTemplateFailure(): CurrentTemplateAction {
  return {
    type: GET_TEMPLATE_FAILURE,
    text: "get single template failure",
  }
}

function failureUpdateCurrentTemplateVersion(): CurrentTemplateAction {
  return {
    type: FAILURE_UPDATE_CURRENT_TEMPLATE_VERSION,
    text: "failure to update current template version"
  }
}

function receiveUpdateCurrentTemplateVersion(templateJSON?: object, sampleDataJSON?: object, version?: string): CurrentTemplateAction {
  return {
    type: RECEIVE_UPDATE_CURRENT_TEMPLATE_VERSION,
    text: "receive update current template version",
    templateJSON: templateJSON,
    sampleDataJSON: sampleDataJSON,
    version: version,
  }
}

function requestUpdateCurrentTemplateVersion(): CurrentTemplateAction {
  return {
    type: REQUEST_UPDATE_CURRENT_TEMPLATE_VERSION,
    text: "request update current template version",
  }
}

export function updateCurrentTemplateVersion(template: Template, version: string) {
  return function (dispatch: any) {
    dispatch(requestUpdateCurrentTemplateVersion());
    if (template.instances) {
      let numInstances = template.instances.length;
      for (let j = 0; j < numInstances; j++) {
        if (template.instances[j] && template.instances[j].version && template.instances[j].version == version) {
          return dispatch(
            receiveUpdateCurrentTemplateVersion(
              template.instances[j].json,
              template.instances[j].data,
              template.instances[j].version,
            )
          )
        }
      }
    }
    dispatch(failureUpdateCurrentTemplateVersion());
  }
}

export function updateTemplate(templateID?: string, currentVersion?: string, templateJSON?: object, sampleDataJSON?: object, templateName?: string, state?: PostedTemplate.StateEnum, tags?: string[], isShareable?: boolean) {
  return function (dispatch: any, getState: () => RootState) {
    const appState = getState();

    const api = initClientSDK(dispatch, getState);

    let newTemplate = new PostedTemplate();
    const id = templateID || appState.currentTemplate.templateID;

    const version = currentVersion ||
      (appState.currentTemplate.template && appState.currentTemplate.template.instances && appState.currentTemplate.template.instances.length > 0 ?
        appState.currentTemplate.template!.instances![0].version : "1.0");

    if (templateJSON) {
      newTemplate.template = templateJSON;
    }
    else {
      newTemplate.template = appState.currentTemplate.templateJSON;
    }
    newTemplate.version = version;
    newTemplate.name = templateName;
    newTemplate.state = state;
    newTemplate.tags = tags;
    newTemplate.isShareable = isShareable;

    if (id === null || id === undefined || id === "") {
      dispatch(requestNewTemplateUpdate());
      return api.createTemplate(newTemplate).then(response => {
        if (response.response.statusCode && response.response.statusCode === 201 && response.body.id) {
          dispatch(receiveNewTemplateUpdate(response.body.id, templateJSON, templateName, sampleDataJSON));
        }
        else {
          dispatch(failureNewTemplateUpdate());
        }
      });
    }
    else {
      dispatch(requestExistingTemplateUpdate());
      console.log("posting existing");
      return api.postTemplateById(id, newTemplate).then(response => {
        if (response.response.statusCode && response.response.statusCode === 201) {
          console.log("success, getting template again");
          dispatch(receiveExistingTemplateUpdate(templateJSON, templateName, sampleDataJSON, version));
          dispatch(getTemplate(id));
        }
        else {
          console.log("fail, ", appState.currentTemplate.isFetching, appState.currentTemplate.template)
          dispatch(failureExistingTemplateUpdate());
        }
      }).catch((error: any) => {
        console.log("catch", error)
        dispatch(failureExistingTemplateUpdate());
      });
    }
  };
}

export function getTemplate(templateID: string) {
  return function (dispatch: any, getState: () => RootState) {
    const appState = getState();
    dispatch(requestTemplate(templateID));

    const api = initClientSDK(dispatch, getState);

    try {
      console.log("getting template")
      api.templateById(templateID, undefined, true).then((resp: any) => {
        if (resp.body.templates.length === 1) {
          const templateObject = resp.body.templates[0];
          return dispatch(
            requestTemplateSuccess(
              templateObject,
              templateObject.instances[0].json,
              templateObject.name,
              templateObject.instances[0].data[0],
              templateObject.instances[0].version,
            ))
        }
        console.log("fail", appState.currentTemplate.isFetching, appState.currentTemplate.template)
        dispatch(requestTemplateFailure());
      })
    }
    catch {
      console.log("fail", appState.currentTemplate.isFetching, appState.currentTemplate.template)
      dispatch(requestTemplateFailure());
    }
  }
}

function initClientSDK(dispatch: any, getState: () => RootState, ): TemplateApi {
  const api = new TemplateApi();
  const state = getState();
  if (state.auth.accessToken) {
    api.setApiKey(0, `Bearer ${state.auth.accessToken!.idToken.rawIdToken}`);
  }
  return api;
}
