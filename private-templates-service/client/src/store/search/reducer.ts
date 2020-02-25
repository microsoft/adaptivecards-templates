import {
  SearchState,
  SEARCH,
  CLEAR_SEARCH,
  SearchAction,
  SET_SEARCHBAR_VISIBLE
} from './types';

const initialState: SearchState = {
  isSearch: false,
  searchValue: "",
  isSearchBarVisible: false
}

export function searchReducer(state = initialState, action: SearchAction): SearchState {
  switch (action.type) {
    case SEARCH:
      return {
        ...state,
        isSearch: true,
        searchValue: action.searchValue
      }
    case CLEAR_SEARCH:
      return {
        ...state,
        isSearch: false,
        searchValue: action.searchValue
      }
    case SET_SEARCHBAR_VISIBLE:
      return {
        ...state,
        isSearch: false,
        searchValue: "",
        isSearchBarVisible: action.isSearchBarVisible
      }
    default:
      return state;
  }
}
