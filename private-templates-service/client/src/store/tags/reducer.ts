import { REQUEST_ALL_TAGS_GET, REQUEST_ALL_TAGS_GET_SUCCESS, REQUEST_ALL_TAGS_GET_FAIL, CLEAR_SELECTED_TAGS, REMOVE_SELECTED_TAG, ADD_SELECTED_TAG, TagsAction, TagsState } from "./types";
import { Tags } from "adaptive-templating-service-typescript-node";

const initialState: TagsState = {
  isFetching: false,
  allTags: new Tags(),
  selectedTags: [],
};

export function tagsReducer(state = initialState, action: TagsAction): TagsState {
  switch (action.type) {
    case REQUEST_ALL_TAGS_GET:
      return {
        ...state,
        isFetching: true,
      };
    case REQUEST_ALL_TAGS_GET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        allTags: action.allTags,
      };
    case REQUEST_ALL_TAGS_GET_FAIL:
      return {
        ...state,
        isFetching: false,
        allTags: new Tags()
      };
    case ADD_SELECTED_TAG:
      return {
        ...state,
        selectedTags: state.selectedTags!.concat(action.tag!),
      };
    case REMOVE_SELECTED_TAG:
      return {
        ...state,
        selectedTags: state.selectedTags!.filter((tag: string) => tag !== action.tag),
      };
    case CLEAR_SELECTED_TAGS:
      return {
        ...state,
        selectedTags: [],
      };
    default:
      return state;
  }
}
