import { Template } from 'adaptive-templating-service-typescript-node';

export default function getVersion(template: Template): string {
  if (template.instances && template.instances[0] && template.instances[0].version) {
    return template.instances[0].version;
  }
  return "1.0"
}