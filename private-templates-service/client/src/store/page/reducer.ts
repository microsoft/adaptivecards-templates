import {
  PageState,
  NAVIGATION,
  PageAction,
  OPEN_MODAL,
  CLOSE_MODAL
} from './types';

const initalState: PageState = {
  currentPageTitle: "",
  currentPage: ""
};

export function pageReducer(state = initalState, action: PageAction): PageState {
  switch (action.type) {
    case NAVIGATION:
      return {
        ...state,
        currentPageTitle: action.currentPageTitle,
        currentPage: action.currentPage
      }
    case OPEN_MODAL:
      return {
        ...state,
        modalOpen: action.modalOpen
      }
    case CLOSE_MODAL:
      return {
        ...state,
        modalOpen: undefined
      }
    default:
      return state;
  }
}
