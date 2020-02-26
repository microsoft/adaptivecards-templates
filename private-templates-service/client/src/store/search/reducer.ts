import {
  SearchState,
  QUERY_SEARCH_BEGIN,
  QUERY_SEARCH_FAILURE,
  QUERY_SEARCH_SUCCESS,
  CLEAR_SEARCH,
  SearchAction,
  SET_SEARCHBAR_VISIBLE
} from './types';
import { TemplateList } from "adaptive-templating-service-typescript-node";

const initialState: SearchState = {
  isSearch: false,
  searchValue: "",
  searchByTemplateName: "",
  loading: false,
  templates: new TemplateList(),
  error: undefined
}

export function searchReducer(state = initialState, action: SearchAction): SearchState {
  switch (action.type) {
    case QUERY_SEARCH_BEGIN:
      return {
        ...state,
        isSearch: true,
        loading: true,

      }
    case QUERY_SEARCH_SUCCESS:
      return {
        ...state,
        isSearch: true,
        loading: false,
        templates: action.cards,
        searchByTemplateName: action.searchByTemplateName
      }
    case QUERY_SEARCH_FAILURE:
      return {
        ...state,
        isSearch: true,
        loading: false,
        templates: new TemplateList(), // this will return an empty list 
        error: action.error
      }
    case CLEAR_SEARCH:
      return {
        ...state,
        isSearch: false,
        loading: false,
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
