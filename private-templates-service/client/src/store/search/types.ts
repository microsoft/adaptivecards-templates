import { IncomingMessage } from "http";

export interface SearchState {
  isSearchBarVisible?: boolean;
  query: string | undefined;
  error?: IncomingMessage;
}

// Action Types 
export const QUERY_SEARCH_SET = 'QUERY_SEARCH_SET';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';
export const SET_SEARCHBAR_VISIBLE = 'SET_SEARCHBAR_VISIBLE';

// Actions
export interface SearchAction {
  type:
  typeof QUERY_SEARCH_SET |
  typeof CLEAR_SEARCH |
  typeof SET_SEARCHBAR_VISIBLE;
  query: string | undefined;
  error?: IncomingMessage;
}
