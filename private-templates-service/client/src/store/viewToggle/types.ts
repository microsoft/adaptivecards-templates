export const SET_TOGGLE_VIEW_TYPE = "SET_TOGGLE_VIEW_TYPE";

export enum ViewType {
    List,
    Grid
}

export interface ViewToggleState {
  viewType: ViewType;
}

export interface ViewToggleAction {
  type: typeof SET_TOGGLE_VIEW_TYPE;
  viewType: ViewType;
}
