import {
  QUERY_SEARCH_SET,
  SearchAction,
  CLEAR_SEARCH
} from './types';



export function querySearchSet(query: string): SearchAction {
  return {
    type: QUERY_SEARCH_SET,
    query: query
  }
}

export function clearSearch(): SearchAction {
  return {
    type: CLEAR_SEARCH,
    query: undefined
  }
}
