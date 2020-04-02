import { SET_TOGGLE_VIEW_TYPE, ViewToggleAction, ViewType, ViewToggleState } from "./types";

const initialState: ViewToggleState = {
  viewType: ViewType.Grid
};
export function viewToggleReducer(state = initialState, action: ViewToggleAction): ViewToggleState {
  switch (action.type) {
    case SET_TOGGLE_VIEW_TYPE:
      return {
        ...state,
        viewType: action.viewType
      };
    default:
      return state;
  }
}
