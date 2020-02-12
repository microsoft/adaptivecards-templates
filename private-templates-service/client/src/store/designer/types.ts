export interface DesignerState {
  templateID: string;
  templateJSON: string;
  sampleDataJSON: string;
}

//Action Types
export const NEW_TEMPLATE = 'NEW_TEMPLATE';
export const EDIT_TEMPLATE = 'EDIT_TEMPLATE';

//Actions
export interface DesignerAction {
  type: typeof NEW_TEMPLATE | typeof EDIT_TEMPLATE;
  text: string;
  templateID: string;
  templateJSON: string;
  sampleDataJSON: string;
}
