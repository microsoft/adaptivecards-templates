import {
  SearchState,
  QUERY_SEARCH_SET,
  CLEAR_SEARCH,
  SearchAction
} from './types';

const initialState: SearchState = {
  query: undefined,
  error: undefined
}

export function searchReducer(state = initialState, action: SearchAction): SearchState {
  switch (action.type) {
    case QUERY_SEARCH_SET:
      return {
        ...state,
        query: action.query
      }

    case CLEAR_SEARCH:
      return {
        ...state,
        query: undefined,
      }
    default:
      return state;
  }
}
