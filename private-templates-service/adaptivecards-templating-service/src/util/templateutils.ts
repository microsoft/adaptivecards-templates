import { ITemplate, ITemplateInstance } from "../models/models";

/**
 * @function
 * Returns a ITemplate object with only the latest version instance. 
 * @param template 
 */
export function getMostRecentTemplate(template : ITemplate): ITemplate {
  if (!template.instances || template.instances.length === 0) return template; 
  let latestInstance : ITemplateInstance[] = [getMostRecentVersion(template)!];
  template.instances = latestInstance;
  return template;
}

/**
 * @function
 * Removes the most recent version/instance from a template object.
 * @param template
 */
export function removeMostRecentTemplate(template: ITemplate): ITemplate {
  if (!template.instances || template.instances.length === 0) return template; 
  let lastVersion : ITemplateInstance = getMostRecentVersion(template)!;
  let templateInstances = []
  for (let instance of template.instances) {
    if (instance.version !== lastVersion.version) templateInstances.push(instance);
  }
  template.instances = templateInstances;
  return template;
}

/**
 * @function
 * Returns the most recent template version/instance given the template.
 * @param template 
 */
export function getMostRecentVersion(template: ITemplate): ITemplateInstance | undefined {
  if (!template.instances || template.instances.length === 0) return undefined;
  let currVersion = "";
  let latestInstance = template.instances[0];
  for (let instance of template.instances){
    if (compareVersion(instance.version, currVersion)) {
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
  for (let instance of template.instances){
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
export function compareVersion(a: string, b: string) {
  let v1 = a.split('.');
  let v2 = b.split('.');
  let length = Math.min(v1.length, v2.length);
  for (let i = 0; i < length; i++){
    let v1i = parseInt(v1[i], 10);
    let v2i = parseInt(v2[i], 10);
    if (v1i > v2i) return true;
    if (v1i < v2i) return false;
  }
  return (v1.length == v2.length)? false : v1.length > v2.length;
}

export function stringifyJSONArray(list: JSON[]): string[] {
  let result = [];
  for (let item of list) {
    result.push(JSON.stringify(item));
  }
  return result;
}

export function JSONStringArray(list: string[]): JSON[] {
  let result = [];
  for (let item of list) {
    result.push(JSON.parse(item));
  }
  return result;
}