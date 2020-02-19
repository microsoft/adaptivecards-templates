import {
  FilterState,
  QUERY_FILTER,
  CLEAR_FILTER,
  FilterAction
} from './types';

const initialState: FilterState = {
  isFilter: false,
  filterType: ""
}

export function filterReducer(state = initialState, action: FilterAction): FilterState {
  switch(action.type) {
    case QUERY_FILTER:
      return {
        ...state,
        isFilter: true,
        filterType: action.filterType
      }
    case CLEAR_FILTER:
      return {
        ...state,
        isFilter: false,
        filterType: ""
      }
    default:
      return state;
  }
}