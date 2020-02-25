export interface SearchState {
  isSearch: boolean;
  searchValue: string;
  isSearchBarVisible?: boolean;
}

// Action Types 
export const SEARCH = 'SEARCH';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';
export const SET_SEARCHBAR_VISIBLE = 'SET_SEARCHBAR_VISIBLE';

// Actions
export interface SearchAction {
  type: typeof SEARCH | typeof CLEAR_SEARCH | typeof SET_SEARCHBAR_VISIBLE;
  text: string;
  searchValue: string;
  isSearchBarVisible?: boolean;
}
