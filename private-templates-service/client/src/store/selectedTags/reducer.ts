import { ADD_SELECTED_TAG, REMOVE_SELECTED_TAG, CLEAR_SELECTED_TAGS, SelectedTagsAction, SelectedTagsState } from "./types";

const initialState: SelectedTagsState = {
  tags: []
}

export function selectedTagsReducer(state = initialState, action: SelectedTagsAction): SelectedTagsState {
  switch (action.type) {
    case ADD_SELECTED_TAG:
      return {
        tags: state.tags.concat(action.tag)
      }
    case REMOVE_SELECTED_TAG:
      return {
        tags: state.tags.filter((tag: string) => tag !== action.tag)
      }
    case CLEAR_SELECTED_TAGS:
      return {
        tags: []
      }
    default:
      return state;
  }
}