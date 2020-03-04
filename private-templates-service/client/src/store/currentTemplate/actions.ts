import {
  CurrentTemplateAction,
  NEW_TEMPLATE,
  REQUEST_NEW_TEMPLATE_UPDATE,
  RECEIVE_NEW_TEMPLATE_UPDATE,
  FAILURE_NEW_TEMPLATE_UPDATE,
  REQUEST_EXISTING_TEMPLATE_UPDATE,
  RECEIVE_EXISTING_TEMPLATE_UPDATE,
  FAILURE_EXISTING_TEMPLATE_UPDATE,
  GET_TEMPLATE,
  GET_TEMPLATE_SUCCESS,
  GET_TEMPLATE_FAILURE,
} from './types';

import { Template, TemplateApi, PostedTemplate } from "adaptive-templating-service-typescript-node";

import { IncomingMessage } from "http";
import { RootState } from '../rootReducer';

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

function receiveNewTemplateUpdate(templateID?: string, templateJSON?: string, templateName?: string, sampleDataJSON?: string): CurrentTemplateAction {
  return {
    type: RECEIVE_NEW_TEMPLATE_UPDATE,
    text: "receiving post new template on save",
    templateID: templateID,
    templateJSON: templateJSON,
    templateName: templateName,
    sampleDataJSON: sampleDataJSON
  };
}

function failureNewTemplateUpdate(error: IncomingMessage): CurrentTemplateAction {
  return {
    type: FAILURE_NEW_TEMPLATE_UPDATE,
    text: "failure post new template on save",
    error: error
  };
}

function requestExistingTemplateUpdate(): CurrentTemplateAction {
  return {
    type: REQUEST_EXISTING_TEMPLATE_UPDATE,
    text: "requesting post existing template on save"
  };
}

function receiveExistingTemplateUpdate(templateJSON?: string, templateName?: string, sampleDataJSON?: string): CurrentTemplateAction {
  return {
    type: RECEIVE_EXISTING_TEMPLATE_UPDATE,
    text: "receiving post existing template on save",
    templateJSON: templateJSON,
    templateName: templateName,
    sampleDataJSON: sampleDataJSON
  };
}

function failureExistingTemplateUpdate(error: IncomingMessage): CurrentTemplateAction {
  return {
    type: FAILURE_EXISTING_TEMPLATE_UPDATE,
    text: "failure post existing template on save",
    error: error
  };
}

function requestTemplate(templateID: string): CurrentTemplateAction {
  return {
    type: GET_TEMPLATE,
    text: "get single template",
    templateID
  }
}

function requestTemplateSuccess(template: Template, templateJSON: string, templateName: string, sampleDataJSON: string): CurrentTemplateAction {
  return {
    type: GET_TEMPLATE_SUCCESS,
    text: "get single template success",
    template,
    templateJSON,
    templateName,
    sampleDataJSON,
  }
}

function requestTemplateFailure(): CurrentTemplateAction {
  return {
    type: GET_TEMPLATE_FAILURE,
    text: "get single template failure",
  }
}

export function updateTemplate(templateID?: string, currentVersion?: string, templateJSON?: string, sampleDataJSON?: string, templateName?: string, state?: PostedTemplate.StateEnum, tags?: string[]) {
  return function (dispatch: any, getState: () => RootState) {
    const appState = getState();

    let api = new TemplateApi();
    api.setApiKey(0, "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSJ9.eyJhdWQiOiI4NjMxY2E0ZS1hMjVkLTQ5YWUtYmQ5OC1mZjNlMWRkZDQ0MTgiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE1ODEzNjA2MTgsIm5iZiI6MTU4MTM2MDYxOCwiZXhwIjoxNTgxMzY0NTE4LCJhaW8iOiI0Mk5nWUdDVzk3Qm1NamRrY3pQK1pLSGZMeFlPQUE9PSIsImF6cCI6Ijg2MzFjYTRlLWEyNWQtNDlhZS1iZDk4LWZmM2UxZGRkNDQxOCIsImF6cGFjciI6IjEiLCJvaWQiOiI4YWRiZWRhNi00ZDdkLTQ1N2ItOTNkZC1jMTVmMWE1Y2NiMzEiLCJzdWIiOiI4YWRiZWRhNi00ZDdkLTQ1N2ItOTNkZC1jMTVmMWE1Y2NiMzEiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1dGkiOiJ6SDlkcHVQNnprcUJidC1MUnVGYkFBIiwidmVyIjoiMi4wIn0.WhdvkqeJymW-Ayeht6tafd8Z1muoMnyPhKoYq6KGrHdv6psfYQtmK0P0-TA5_zgOOHNNJvpVqH2LPnZTbpK4qgKLByR9umELHgD2FW9v5Djg1NAKqmQEGg_-Th__SGE3L9_WI58Wh0_Toh3f7fpLDzNBiC5iYDdGSaTilwxaYMGbXnJO2Y6Tow83GQATKGA3B27Xz2iBO9UFmEy9rte4DyLUAEIE6SCKwg-3YuD0zKfpgyd-lvhZZr37HeE9Y6hyOm_M4b_jwWI7oK0uZASuQer83W5jsSZNtiXg_T0euXJcvI9lL6R4oJDI_N6Y42RdDioIwX6FzOA4vRzTySZjBw");

    let newTemplate = new PostedTemplate();
    const id = templateID || appState.currentTemplate.templateID;
    
    const version = currentVersion || 
    (appState.currentTemplate.template && appState.currentTemplate.template.instances && appState.currentTemplate.template.instances.length > 0 ?
    appState.currentTemplate.template!.instances![0].version : "1.0");

    if (templateJSON) {
      newTemplate.template = JSON.parse(templateJSON);
    } else {
      newTemplate.template = appState.currentTemplate.templateJSON;
    }

    newTemplate.name = templateName;
    newTemplate.state = state;
    newTemplate.tags = tags;
    newTemplate.version = version;

    if (id === null || id === undefined || id === "") {
      dispatch(requestNewTemplateUpdate());
      return api.createTemplate(newTemplate).then(response => {
        if (response.response.statusCode && response.response.statusCode === 201 && response.body.id) {
          dispatch(receiveNewTemplateUpdate(response.body.id, templateJSON, templateName, sampleDataJSON));
        } else {
          dispatch(failureNewTemplateUpdate(response.response));
        }
      });
    }
    else {
      dispatch(requestExistingTemplateUpdate());
      return api.postTemplateById(id, newTemplate).then(response => {
        if (response.response.statusCode && response.response.statusCode === 201) {
          dispatch(receiveExistingTemplateUpdate(templateJSON, templateName, sampleDataJSON));
          dispatch(getTemplate(id));
        }
        else {
          dispatch(failureExistingTemplateUpdate(response.response));
        }
      });
    }
  };
}

export function getTemplate(templateID: string) {
  return function (dispatch: any) {
    dispatch(requestTemplate(templateID));

    const api = new TemplateApi();
    api.setApiKey(0, "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSJ9.eyJhdWQiOiI4NjMxY2E0ZS1hMjVkLTQ5YWUtYmQ5OC1mZjNlMWRkZDQ0MTgiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE1ODEzNjA2MTgsIm5iZiI6MTU4MTM2MDYxOCwiZXhwIjoxNTgxMzY0NTE4LCJhaW8iOiI0Mk5nWUdDVzk3Qm1NamRrY3pQK1pLSGZMeFlPQUE9PSIsImF6cCI6Ijg2MzFjYTRlLWEyNWQtNDlhZS1iZDk4LWZmM2UxZGRkNDQxOCIsImF6cGFjciI6IjEiLCJvaWQiOiI4YWRiZWRhNi00ZDdkLTQ1N2ItOTNkZC1jMTVmMWE1Y2NiMzEiLCJzdWIiOiI4YWRiZWRhNi00ZDdkLTQ1N2ItOTNkZC1jMTVmMWE1Y2NiMzEiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1dGkiOiJ6SDlkcHVQNnprcUJidC1MUnVGYkFBIiwidmVyIjoiMi4wIn0.WhdvkqeJymW-Ayeht6tafd8Z1muoMnyPhKoYq6KGrHdv6psfYQtmK0P0-TA5_zgOOHNNJvpVqH2LPnZTbpK4qgKLByR9umELHgD2FW9v5Djg1NAKqmQEGg_-Th__SGE3L9_WI58Wh0_Toh3f7fpLDzNBiC5iYDdGSaTilwxaYMGbXnJO2Y6Tow83GQATKGA3B27Xz2iBO9UFmEy9rte4DyLUAEIE6SCKwg-3YuD0zKfpgyd-lvhZZr37HeE9Y6hyOm_M4b_jwWI7oK0uZASuQer83W5jsSZNtiXg_T0euXJcvI9lL6R4oJDI_N6Y42RdDioIwX6FzOA4vRzTySZjBw");

    try {
      api.templateById(templateID).then((resp: any) => {
        if (resp.body.templates.length === 1) {
          const templateObject = resp.body.templates[0];
          return dispatch(
            requestTemplateSuccess(
              templateObject,
              templateObject.instances[0].json,
              templateObject.name,
              ""
            ))
        }
        dispatch(requestTemplateFailure());
      })
    }
    catch {
      dispatch(requestTemplateFailure());
    }
  }
}
