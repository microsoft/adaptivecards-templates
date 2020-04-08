import { REQUEST_TAGS_GET, REQUEST_TAGS_GET_SUCCESS, REQUEST_TAGS_GET_FAIL, AllTagsState, AllTagsAction } from "./types";
import { TagList } from "adaptive-templating-service-typescript-node";

const initialState: AllTagsState = {
  isFetching: false,
  tags: new TagList()
}

export function allTagsReducer(state = initialState, action: AllTagsAction): AllTagsState {
  switch (action.type) {
    case REQUEST_TAGS_GET:
      return {
        ...state,
        isFetching: true,
      }
    case REQUEST_TAGS_GET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        tags: action.tags
      }
    case REQUEST_TAGS_GET_FAIL:
      return {
        ...state,
        isFetching: false,
        tags: new TagList()
      }
    default:
      return state;
  }
}
