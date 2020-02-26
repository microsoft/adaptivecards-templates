import {
  PageState,
  NAVIGATION,
  PageAction
} from './types';

const initalState: PageState = {
  currentPageTitle: "",
  currentPage: ""
}

export function pageReducer(state = initalState, action: PageAction): PageState {
  switch (action.type) {
    case NAVIGATION:
      return {
        ...state,
        currentPageTitle: action.currentPageTitle,
        currentPage: action.currentPage
      }
    default:
      return state;
  }
}
