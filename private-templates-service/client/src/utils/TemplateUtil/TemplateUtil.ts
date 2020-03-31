import { Template, PostedTemplate, TemplateApi } from 'adaptive-templating-service-typescript-node';
import { RootState } from "../../store/rootReducer"

export function getLatestVersion(template?: Template): string {
  if (template && template.instances && template.instances[0] && template.instances[0].version) {
    return template.instances[0].version;
  }
  return "1.0"
}

export function getLatestTemplateInstanceState(template: Template): string {
  if (template.instances && template.instances[0] && template.instances[0].state) {
    let state = template.instances[0].state;
    return PostedTemplate.StateEnum[state];
  }
  // should never reach the next line
  return "";
}

export function initClientSDK(dispatch: any, getState: () => RootState, ): TemplateApi {
  const api = new TemplateApi();
  const state = getState();
  if (state.auth.accessToken) {
    api.setApiKey(0, `Bearer ${state.auth.accessToken!.accessToken}`);
  }
  return api;
}

export function populateTemplate(getState: () => RootState): PostedTemplate {
  const appState = getState();
  let newTemplate = new PostedTemplate();

  const version = (appState.currentTemplate.template
    && appState.currentTemplate.template.instances
    && appState.currentTemplate.template.instances.length > 0)
    ? appState.currentTemplate.template.instances[0].version
    : '1.0';

  newTemplate.version = version;
  return newTemplate;
}
