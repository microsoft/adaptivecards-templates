import {
  REQUEST_RECENT_TEMPLATES_GET,
  REQUEST_RECENT_TEMPLATES_GET_SUCCESS,
  REQUEST_RECENT_TEMPLATES_GET_FAIL,
  RecentTemplatesAction,
  RecentTemplatesState
} from "./types";

const initialState: RecentTemplatesState = {
  isFetching: false
};

export function recentTemplatesReducer(
  state = initialState,
  action: RecentTemplatesAction
): RecentTemplatesState {
  switch (action.type) {
    case REQUEST_RECENT_TEMPLATES_GET:
      return {
        ...state,
        isFetching: true
      };
    case REQUEST_RECENT_TEMPLATES_GET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        recentlyEdited: action.recentlyEdited,
        recentlyViewed: action.recentlyViewed
      };
    case REQUEST_RECENT_TEMPLATES_GET_FAIL:
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
}
