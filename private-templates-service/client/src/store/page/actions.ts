import { PageAction, NAVIGATION } from "./types";

export function setPage(currentPage: string): PageAction{
  return{
    type: NAVIGATION,
    text: "The user has changed the page",
    currentPage: currentPage
  }
}
