import { PageState, NAVIGATION, PageAction } from "./types";

const initalState: PageState = {
  currentPageTitle: ""
};

export function pageReducer(state = initalState, action: PageAction): PageState {
  switch (action.type) {
    case NAVIGATION:
      return {
        ...state,
        currentPageTitle: action.currentPageTitle
      };
    default:
      return state;
  }
}
