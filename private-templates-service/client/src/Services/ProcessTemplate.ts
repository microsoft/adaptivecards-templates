export const processTemplate = (template: string) => {
  let parsedTemplate = template.replace(/(\\"(.*?)\\")/g, '"$2"');
  parsedTemplate = parsedTemplate.substr(1, parsedTemplate.length - 2);
  return parsedTemplate;
}

export default processTemplate;
