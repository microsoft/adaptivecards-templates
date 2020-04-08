export interface SelectedTagsState {
  tags: string[];
}

//Action Types
export const ADD_SELECTED_TAG = "ADD_SELECTED_TAG";
export const REMOVE_SELECTED_TAG = "REMOVE_SELECTED_TAG";
export const CLEAR_SELECTED_TAGS = "CLEAR_SELECTED_TAGS";

//Actions
export interface SelectedTagsAction {
  type: typeof ADD_SELECTED_TAG | typeof REMOVE_SELECTED_TAG | typeof CLEAR_SELECTED_TAGS;
  tag: string
}
