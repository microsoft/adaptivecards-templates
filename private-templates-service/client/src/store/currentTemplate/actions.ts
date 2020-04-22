import {
  CurrentTemplateAction,
  NEW_TEMPLATE,
  REQUEST_NEW_TEMPLATE_UPDATE,
  RECEIVE_NEW_TEMPLATE_UPDATE,
  FAILURE_NEW_TEMPLATE_UPDATE,
  REQUEST_EXISTING_TEMPLATE_UPDATE,
  RECEIVE_EXISTING_TEMPLATE_UPDATE,
  FAILURE_EXISTING_TEMPLATE_UPDATE,
  RECEIVE_EXISTING_TEMPLATE_STATE_UPDATE,
  REQUEST_EXISTING_TEMPLATE_UPDATE_TAGS,
  RECIEVE_EXISTING_TEMPLATE_UPDATE_TAGS,
  FAILURE_EXISTING_TEMPLATE_UPDATE_TAGS,
  REQUEST_UPDATE_CURRENT_TEMPLATE_VERSION,
  RECEIVE_UPDATE_CURRENT_TEMPLATE_VERSION,
  FAILURE_UPDATE_CURRENT_TEMPLATE_VERSION,
  GET_TEMPLATE,
  GET_TEMPLATE_TAGS,
  GET_TEMPLATE_SUCCESS,
  GET_TEMPLATE_FAILURE,
  DELETE_TEMPLATE_INSTANCE,
  DELETE_TEMPLATE_INSTANCE_SUCCESS,
  DELETE_TEMPLATE_INSTANCE_FAILURE
} from './types';

import { Template, PostedTemplate, UpdateTemplateState } from "adaptive-templating-service-typescript-node";

import { RootState } from '../rootReducer';
import { initClientSDK, populateTemplate } from '../../utils/TemplateUtil';

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

function receiveExistingTemplateStateUpdate(template?: Template): CurrentTemplateAction {
  return {
    type: RECEIVE_EXISTING_TEMPLATE_STATE_UPDATE,
    text: "receiving post existing template state",
    template: template
  };
}

function requestExistingTemplateUpdateTags(): CurrentTemplateAction {
  return {
    type: REQUEST_EXISTING_TEMPLATE_UPDATE_TAGS,
    text: "Update tags",
  }
}

function recieveExistingTemplateUpdateTags(): CurrentTemplateAction {
  return {
    type: RECIEVE_EXISTING_TEMPLATE_UPDATE_TAGS,
    text: "Update tags success",
  }
}

function failureExistingTemplateUpdateTags(): CurrentTemplateAction {
  return {
    type: FAILURE_EXISTING_TEMPLATE_UPDATE_TAGS,
    text: "Update tags failure",
  }
}

function requestTemplate(templateID: string): CurrentTemplateAction {
  return {
    type: GET_TEMPLATE,
    text: "get single template",
    templateID
  }
}

function requestTemplateTags(templateID: string): CurrentTemplateAction {
  return {
    type: GET_TEMPLATE_TAGS,
    text: "get single template tags",
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

function deleteTemplateInstance(): CurrentTemplateAction {
  return {
    type: DELETE_TEMPLATE_INSTANCE,
    text: "delete specific template version"
  }
}

function deleteTemplateInstanceSuccess(template?: Template): CurrentTemplateAction {
  return {
    type: DELETE_TEMPLATE_INSTANCE_SUCCESS,
    text: "delete specific template version success",
    template
  }
}

function deleteTemplateInstanceFailure(): CurrentTemplateAction {
  return {
    type: DELETE_TEMPLATE_INSTANCE_FAILURE,
    text: "delete specific template version failure",
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
        if (template.instances[j] && template.instances[j].version && template.instances[j].version === version) {
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
    const newTemplate = populateTemplate(getState);

    const id = templateID || appState.currentTemplate.templateID;

    if (templateJSON) {
      newTemplate.template = templateJSON;
    }

    if (sampleDataJSON) {
      // TODO: the clientSDK, backend, and DB adapter should be refactored such that the data is a json object and not an array of objects
      newTemplate.data = new Array(sampleDataJSON);
    }
    else if (appState.currentTemplate.sampleDataJSON) {
      newTemplate.data = new Array(appState.currentTemplate.sampleDataJSON);
    }

    newTemplate.version = currentVersion || newTemplate.version;
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
      }).catch((error: any) => {
        dispatch(failureNewTemplateUpdate());
      });
    }
    else {
      dispatch(requestExistingTemplateUpdate());
      return api.postTemplateById(id, newTemplate).then(response => {
        if (response.response.statusCode && response.response.statusCode === 201) {
          dispatch(receiveExistingTemplateUpdate(templateJSON, templateName, sampleDataJSON, newTemplate.version));
          dispatch(getTemplate(id));
        }
        else {
          dispatch(failureExistingTemplateUpdate());
        }
      }).catch((error: any) => {
        dispatch(failureExistingTemplateUpdate());
      });
    }
  };
}

export function updateTemplateTags(tags: string[]) {
  return function (dispatch: any, getState: () => RootState) {
    const appState = getState();

    let newTemplate = populateTemplate(getState);
    const api = initClientSDK(dispatch, getState);

    const id = appState.currentTemplate.templateID;
    newTemplate.tags = tags;

    dispatch(requestExistingTemplateUpdateTags());
    if (id !== undefined) {
      return api.postTemplateById(id, newTemplate).then(response => {
        if (response.response.statusCode && response.response.statusCode === 201) {
          dispatch(recieveExistingTemplateUpdateTags());
          dispatch(getTemplate(id, requestTemplateTags));
        } else {
          dispatch(failureExistingTemplateUpdateTags());
        }
      }).catch((error: any) => {
        dispatch(failureExistingTemplateUpdateTags());
      })
    }
  }
}


export function getTemplate(templateID: string, action?: (templateID: string) => CurrentTemplateAction) {
  return function (dispatch: any, getState: () => RootState) {
    dispatch(action ? action(templateID) : requestTemplate(templateID));
    const api = initClientSDK(dispatch, getState);

    try {
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
        dispatch(requestTemplateFailure());
      }).catch((error: any) => {
        dispatch(requestTemplateFailure());
      });
    }
    catch {
      dispatch(requestTemplateFailure());
    }
  }
}

export function deleteTemplateVersion(templateVersion: string, templateID?: string) {
  return function (dispatch: any, getState: () => RootState) {
    const appState = getState();
    const id = templateID || appState.currentTemplate.templateID;

    dispatch(deleteTemplateInstance());

    const api = initClientSDK(dispatch, getState);

    if (!id || id === "") {
      dispatch(deleteTemplateInstanceFailure());
    }

    try {
      api.deleteTemplateById(id!, templateVersion).then((resp: any) => {
        if (resp.response.statusCode && resp.response.statusCode === 204) {
          let template = appState.currentTemplate.template;
          if (template) {
            removeTemplateVersions(template, [templateVersion]);
            if (template.instances && template.instances.length === 0) {
              template = undefined;
            }
          }
          return dispatch(deleteTemplateInstanceSuccess(template));
        }
        return dispatch(deleteTemplateInstanceFailure());
      }).catch((error: any) => {
        dispatch(deleteTemplateInstanceFailure());
      });
    }
    catch {
      dispatch(deleteTemplateInstanceFailure());
    }
  }
}

export function batchDeleteTemplateVersions(versionList: string[], templateID?: string) {
  return function (dispatch: any, getState: () => RootState) {
    const appState = getState();
    const id = templateID || appState.currentTemplate.templateID;
    dispatch(deleteTemplateInstance());
    const api = initClientSDK(dispatch, getState);
    if (!id || id === "") {
      dispatch(deleteTemplateInstanceFailure());
    }
    try {
      api.batchTemplateDelete(id!, { versions: versionList }).then((resp: any) => {
        if (resp.response.statusCode && resp.response.statusCode === 204) {
          let template = appState.currentTemplate.template;
          if (template) {
            removeTemplateVersions(template, versionList);
            if (template.instances && template.instances.length === 0) {
              template = undefined;
            }
          }
          return dispatch(deleteTemplateInstanceSuccess(template));
        }
        return dispatch(deleteTemplateInstanceFailure());
      }).catch((error: any) => {
        dispatch(deleteTemplateInstanceFailure());
      });
    }
    catch {
      dispatch(deleteTemplateInstanceFailure());
    }
  }
}

export function batchUpdateTemplateState(versionList: string[], stateList: PostedTemplate.StateEnum[], templateID?: string) {
  return function (dispatch: any, getState: () => RootState) {
    const appState = getState();
    const id = templateID || appState.currentTemplate.templateID;
    dispatch(requestExistingTemplateUpdate());
    const api = initClientSDK(dispatch, getState);
    if (!id || id === "") {
      dispatch(failureExistingTemplateUpdate());
    }
    let requestList: UpdateTemplateState[] = [];
    for (let i = 0; i < versionList.length; i++) {
      requestList.push({ version: versionList[i], state: stateList[i] });
    }

    try {
      api.batchTemplateUpdate(id!, { "templates": requestList }).then((resp: any) => {
        let template = appState.currentTemplate.template;
        if (resp.response.statusCode && resp.response.statusCode === 201) {
          if (template) updateTemplateVersionStates(template, versionList, stateList);
          dispatch(receiveExistingTemplateStateUpdate(template));
          dispatch(getTemplate(id!));
        } else {
          return dispatch(failureExistingTemplateUpdate());
        }
      }).catch((error: any) => {
        dispatch(failureExistingTemplateUpdate());
      });
    }
    catch {
      dispatch(failureExistingTemplateUpdate());
    }
  }
}

function updateTemplateVersionStates(template: Template, versionList: string[], stateList: PostedTemplate.StateEnum[]) {
  if (!template.instances) return;
  for (let instance of template.instances) {
    if (instance.version && versionList.includes(instance.version)) {
      instance.state = stateList[versionList.indexOf(instance.version)];
    }
  }
}

function removeTemplateVersions(template: Template, versionList: string[]) {
  if (!template.instances) return;
  let instanceList = [];
  for (let instance of template.instances) {
    if (instance.version && versionList.includes(instance.version)) continue;
    instanceList.push(instance);
  }
  template.instances = instanceList;
}

