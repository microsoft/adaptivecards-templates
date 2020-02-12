import { DesignerState, NEW_TEMPLATE, EDIT_TEMPLATE, DesignerAction } from './types';

const initialState: DesignerState = {
  templateID: "",
  templateJSON: "",
  sampleDataJSON: ""
};

export function designerReducer(state = initialState, action: DesignerAction): DesignerState {
  switch (action.type) {
    case NEW_TEMPLATE:
      return {
        ...state,
        templateID: "",
        templateJSON: "",
        sampleDataJSON: ""
      }
    case EDIT_TEMPLATE:
      return {
        ...state,
        templateID: action.templateID,
        templateJSON: action.templateJSON,
        sampleDataJSON: action.sampleDataJSON
      }
    default:
      return state;
  }
} 
