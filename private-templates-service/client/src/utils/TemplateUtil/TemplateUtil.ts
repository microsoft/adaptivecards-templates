import { Template, PostedTemplate, TemplateApi, TemplateInstance } from 'adaptive-templating-service-typescript-node';
import { RootState } from "../../store/rootReducer"

export function getLatestVersion(template?: Template): string {
  if (template && template.instances && template.instances[0] && template.instances[0].version) {
    return template.instances[0].version;
  }
  return "1.0"
}

export function getTemplateInstance(template: Template, templateVersion: string): TemplateInstance | undefined {
  if (template.instances) {
    for (let instance of template.instances) {
      return instance.version === templateVersion ? instance : undefined;
    }
  }
  return undefined;
}

export function isTemplateInstanceShareable(template: Template, templateVersion: string): boolean | undefined {
  let instance = getTemplateInstance(template, templateVersion);
  return instance ? instance.isShareable : undefined;
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
  const state = getState();
  const api = new TemplateApi(state.auth.redirectUri);
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

export function getShareURL(templateID?: string, templateVersion?: string): string {
  return "/preview/" + templateID + "/" + templateVersion;
}

export function getVersionNumber(template: Template, currentVersion: string): string {
  let templateInstance = getTemplateInstance(template, currentVersion);
  if (templateInstance && templateInstance.state === PostedTemplate.StateEnum.Draft) {
    return currentVersion;
  }
  else {
    let currentVersionNumber = +currentVersion;
    return (currentVersionNumber + 0.1).toString().slice(0, 3);
  }
}
