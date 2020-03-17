import { Template, PostedTemplate } from 'adaptive-templating-service-typescript-node';

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