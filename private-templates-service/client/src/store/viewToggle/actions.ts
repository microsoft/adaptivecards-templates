import { SET_TOGGLE_VIEW_TYPE, ViewToggleAction, ViewType} from "./types";

export function setViewToggleType(viewType: ViewType): ViewToggleAction {
  return {
    type: SET_TOGGLE_VIEW_TYPE,
    viewType: viewType
  };
}
