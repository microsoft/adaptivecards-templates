import { SkipLinkState, SET_SKIP_LINK_CONTENT_ID, SkipLinkAction } from "./types";
import { DASHBOARD_MAIN_CONTENT_ID } from "../../components/Dashboard";

const initialState: SkipLinkState = {
  contentID: DASHBOARD_MAIN_CONTENT_ID
};
export function skipLinkReducer(state = initialState, action: SkipLinkAction): SkipLinkState {
  switch (action.type) {
    case SET_SKIP_LINK_CONTENT_ID:
      return {
        ...state,
        contentID: action.contentID
      };
    default:
      return state;
  }
}
