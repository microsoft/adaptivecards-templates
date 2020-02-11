import { NEW_TEMPLATE, DesignerAction, EDIT_TEMPLATE } from './types';

export function newTemplate(): DesignerAction {
  return {
    type: NEW_TEMPLATE,
    text: "User has pressed the 'New Template' button",
    templateID: "",
    templateJSON: "",
    sampleDataJSON: ""
  };
}

export function editTemplate(templateID: string, templateJSON: string, sampleDataJSON: string): DesignerAction {
  return {
    type: EDIT_TEMPLATE,
    text: "User clicked a pre-existing template for editting.",
    templateID: templateID,
    templateJSON: templateJSON,
    sampleDataJSON: sampleDataJSON
  }
}