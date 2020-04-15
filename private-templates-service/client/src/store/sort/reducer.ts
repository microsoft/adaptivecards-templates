import {
  CLEAR_SORT,
  QUERY_SORT,
  SortAction,
  SortState
} from './types';

const initialState: SortState = {
  isSort: false,
  sortType: undefined
}

export function sortReducer(state = initialState, action: SortAction): SortState {
  switch(action.type) {
    case QUERY_SORT:
      return {
        ...state,
        isSort: true,
        sortType: action.sortType
      }
    case CLEAR_SORT:
      return {
        ...state,
        isSort: false,
        sortType: undefined
      }
    default:
      return state;
  }
}
