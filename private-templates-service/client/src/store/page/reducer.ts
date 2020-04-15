import {
  PageState,
  NAVIGATION,
  PageAction,
  OPEN_MODAL,
  CLOSE_MODAL
} from './types';

const initalState: PageState = {
  currentPageTitle: "",
  currentPage: "",
  modalState: undefined
}

export function pageReducer(state = initalState, action: PageAction): PageState {
  switch (action.type) {
    case NAVIGATION:
      return {
        ...state,
        currentPageTitle: action.currentPageTitle,
        currentPage: action.currentPage,
        previousPage: state.currentPage
      };
    case OPEN_MODAL:
      return {
        ...state,
        modalState: action.modalState
      };
    case CLOSE_MODAL:
      return {
        ...state,
        modalState: undefined
      };
    default:
      return state;
  }
}
