import {
  PageAction,
  NAVIGATION,
  OPEN_MODAL,
  CLOSE_MODAL
}
  from "./types";
import StateBlock from "markdown-it/lib/rules_block/state_block";

export function setPage(currentPageTitle: string, currentPage: string): PageAction {
  return {
    type: NAVIGATION,
    text: "The user has changed the page",
    currentPageTitle: currentPageTitle,
    currentPage: currentPage
  };
}

export function openModal(modalName: string): PageAction {
  return {
    type: OPEN_MODAL,
    text: "opening " + modalName.toLowerCase() + " modal",
    modalOpen: modalName
  }
}

export function closeModal(): PageAction {
  return {
    type: CLOSE_MODAL,
    text: "closing modal",
    modalOpen: undefined
  }
}