import {
  PageAction,
  NAVIGATION,
  OPEN_MODAL,
  CLOSE_MODAL,
  ModalState
}
  from "./types";

export function setPage(currentPageTitle: string, currentPage: string): PageAction {
  return {
    type: NAVIGATION,
    text: "The user has changed the page",
    currentPageTitle: currentPageTitle,
    currentPage: currentPage
  };
}

export function openModal(modalState: ModalState): PageAction {
  return {
    type: OPEN_MODAL,
    text: "opening " + modalState.toString() + " modal",
    modalState: modalState
  }
}

export function closeModal(): PageAction {
  return {
    type: CLOSE_MODAL,
    text: "closing modal",
    modalState: undefined
  }
}
