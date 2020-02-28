export interface PageState {
  currentPageTitle: string;
}

// Action Types
export const NAVIGATION = "NAVIGATION";

// Actions
export interface PageAction {
  type: typeof NAVIGATION;
  text: string;
  currentPageTitle: string;
}
