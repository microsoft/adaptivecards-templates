import { PageAction, NAVIGATION } from "./types";

export function setPage(currentPageTitle: string): PageAction {
  return {
    type: NAVIGATION,
    text: "The user has changed the page",
    currentPageTitle: currentPageTitle
  };
}
