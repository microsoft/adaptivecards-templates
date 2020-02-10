import { DesignerState, NEW_TEMPLATE, EDIT_TEMPLATE, DesignerAction } from './types';

const initialState: DesignerState = {
  isNewTemplate: true,
  templateID: ""
};

export function designerReducer(state = initialState, action: DesignerAction): DesignerState {
  switch (action.type) {
    case NEW_TEMPLATE:
      return {
        ...state,
        isNewTemplate: true,
        templateID: ""
      }
    case EDIT_TEMPLATE:
      return {
        ...state,
        isNewTemplate: false,
        templateID: action.templateID
      }
    default:
      return state;
  }
}