export interface PageState {
  currentPage: string;
}

// Action Types
export const NAVIGATION = "NAVIGATION";

// Actions 
export interface PageAction{
  type: typeof NAVIGATION;
  text: string;
  currentPage: string;
}
