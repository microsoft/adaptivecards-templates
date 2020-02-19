import {
  SearchState,
  SEARCH,
  CLEAR_SEARCH,
  SearchAction
} from './types';

const initialState: SearchState = {
  isSearch: false,
  searchValue: "",
}

export function searchReducer( state = initialState, action: SearchAction): SearchState{
  switch(action.type){
    case  SEARCH:
      return {
        ...state,
        isSearch: true,
        searchValue: action.searchValue
      }
    case  CLEAR_SEARCH:
      return {
        ...state,
        isSearch: false,
        searchValue: action.searchValue
      }
    default:
      return state;
  }
}
