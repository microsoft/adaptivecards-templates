import { RecentTemplatesAction, RecentTemplatesState, RecentTemplatesActionsTypes } from "./types";
import { UserList } from "adaptive-templating-service-typescript-node";

const initialState: RecentTemplatesState = {
  isFetching: false
};

export function recentTemplatesReducer(state = initialState, action: RecentTemplatesAction): RecentTemplatesState {
  switch (action.type) {
    case RecentTemplatesActionsTypes.REQUEST_RECENT_TEMPLATES_GET:
      return {
        ...state,
        isFetching: true
      };
    case RecentTemplatesActionsTypes.REQUEST_RECENT_TEMPLATES_GET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        recentlyEdited: action.recentlyEdited,
        recentlyViewed: action.recentlyViewed
      };
    case RecentTemplatesActionsTypes.REQUEST_RECENT_TEMPLATES_GET_FAIL:
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
}
