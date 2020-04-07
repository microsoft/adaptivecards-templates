import { CLEAR_SORT, SortAction, QUERY_SORT, SortType } from './types';

export function querySort(sortType: SortType): SortAction {
  return {
    type: QUERY_SORT,
    text: "User has selected one of the sort options to query",
    sortType: sortType
    //TODO use thunk to get templates
  }
}

export function clearSort(): SortAction {
  return {
    type: CLEAR_SORT,
    text: "User has cleard the sort Paramaters",
    sortType: undefined
  }
}
