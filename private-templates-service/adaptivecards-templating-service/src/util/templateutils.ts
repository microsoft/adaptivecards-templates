import { ITemplate, ITemplateInstance, TemplateState } from "../models/models";

import * as ACData from "adaptivecards-templating";
/**
 * @function
 * Updates passed ITemplate object to only have the latest version instance.
 * @param template
 */
export function updateTemplateToLatestInstance(template: ITemplate) {
  if (!template.instances || template.instances.length === 0) return template;
  let latestInstance: ITemplateInstance[] = [getMostRecentVersion(template)!];
  template.instances = latestInstance;
}

/**
 * @function
 * Removes the most recent version/instance from a template object.
 * Updates the deletedVersion array as well.
 * @param template
 */
export function removeMostRecentTemplate(template: ITemplate): ITemplate {
  if (!template.instances || template.instances.length === 0) return template;
  let lastVersion: ITemplateInstance = getMostRecentVersion(template)!;
  let templateInstances = [];
  for (let instance of template.instances) {
    if (instance.version !== lastVersion.version) templateInstances.push(instance);
  }
  template.instances = templateInstances;
  template.deletedVersions?.push(lastVersion.version);
  return template;
}

/**
 * @function
 * Returns the most recent template version/instance given the template.
 * @param template
 */
export function getMostRecentVersion(template: ITemplate): ITemplateInstance | undefined {
  if (!template.instances || template.instances.length === 0) return undefined;
  let latestInstance = template.instances[0];
  for (let instance of template.instances) {
    if (compareVersion(instance.version, latestInstance.version)) {
      latestInstance = instance;
    }
  }
  return latestInstance;
}

/**
 * @function
 * Returns the specified template version/instance.
 * @param template
 * @param version
 */
export function getTemplateVersion(template: ITemplate, version: string): ITemplateInstance | undefined {
  if (!template.instances || template.instances.length === 0) return undefined;
  for (let instance of template.instances) {
    if (version === instance.version) {
      return instance;
    }
  }
  return undefined;
}

/**
 * @function
 * Returns true if a's version is greater than b, returns false if the same
 */
export function compareVersion(a: string, b: string): boolean {
  let v1 = a.split(".");
  let v2 = b.split(".");
  let length = Math.min(v1.length, v2.length);
  for (let i = 0; i < length; i++) {
    let v1i = parseInt(v1[i], 10);
    let v2i = parseInt(v2[i], 10);
    if (v1i > v2i) return true;
    if (v1i < v2i) return false;
  }
  return v1.length == v2.length ? false : v1.length > v2.length;
}


/**
 * @function
 * @param template 
 * 
 */
export function incrementVersion(template: ITemplate): string {
  // check if this is the most recent version 
  let latestTemplate = getMostRecentVersion(template);
  if (!latestTemplate?.version) return "";
  return incrementVersionStr(latestTemplate?.version);
}

export function incrementVersionStr(latestVersion: string): string {
  // check if this is the most recent version 
  let version = latestVersion.split(".");

  if (!version) {
    return "1.0";
  }
  if (version[1] === "9") {
    version[0] = (parseInt(version[0]) + 1).toString();
    version[1] = "0";
  }
  else {
    version[1] = (parseInt(version[1]) + 1).toString();
  }
  return (version[0] + "." + version[1]);
}


export function setTemplateInstanceParam(templateInstance: ITemplateInstance, templateData: JSON[] | undefined, state: TemplateState | undefined, isShareable: boolean | undefined, version?: string, template?: JSON): ITemplateInstance {
  // set params for the template instance. 
  templateInstance.state = state || TemplateState.draft;
  templateInstance.isShareable = isShareable || false;
  templateInstance.data = templateData || [];
  templateInstance.version = version || "1.0";
  templateInstance.json = template || templateInstance.json;
  return templateInstance;
}

export function anyVersionsLive(templates: ITemplateInstance[]): boolean {
  if (!templates) {
    return false;
  }
  for (let instance of templates) {
    if (instance.state === TemplateState.live) {
      return true;
    }
  }
  return false;
}
/**
 * @function
 */
export function compareTemplateVersions(a: ITemplateInstance, b: ITemplateInstance): number {
  return compareVersion(a.version, b.version) ? -1 : 1;
}

/**
 * @function
 * Sort template by most recent version
 * @param template 
 */
export function sortTemplateByVersion(template: ITemplate) {
  if (!template.instances) return;
  let instances: ITemplateInstance[] = template.instances.sort(compareTemplateVersions);
  template.instances = instances;
}

/**
 * @function
 * @param input 
 */
export function isValidJSONString(input: string) {
  try {
    JSON.parse(input);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * Get token from authorization header.
 * @param token 
 */
export function parseToken(token: string): string {
  let bearer = token.split(/[ ]+/).pop();
  return bearer || "";
}

export function createCard(template: JSON, data: JSON): JSON {
  try {
    let dataTemplate: ACData.Template = new ACData.Template(template);
    let context: ACData.EvaluationContext = new ACData.EvaluationContext();
    context.$root = data;
    let card: JSON = dataTemplate.expand(context);
    return card;
  }
  catch {
    return JSON.parse('{}');
  }
}

/**
 * Returns whether the state change is valid. 
 * @param currState 
 * @param desiredState 
 */
export function checkValidTemplateState(currState: TemplateState, desiredState: TemplateState): boolean {
  switch (currState) {
    case TemplateState.draft:
      return desiredState !== TemplateState.deprecated;
    case TemplateState.deprecated:
      return desiredState === TemplateState.deprecated;
    case TemplateState.live:
      return desiredState !== TemplateState.draft;
    default:
      return false;
  }
}