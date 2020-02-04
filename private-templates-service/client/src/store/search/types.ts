export interface SearchState {
  isSearch: boolean;
  searchValue: string;
}

// Action Types 
export const SEARCH = 'SEARCH';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';

// Actions
export interface SearchAction{
  type: typeof SEARCH | typeof CLEAR_SEARCH;
  text: string
  searchValue: string
}