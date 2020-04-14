import {
  FilterState,
  QUERY_FILTER,
  CLEAR_FILTER,
  FilterAction
} from './types';

const initialState: FilterState = {
  isFilter: false,
  filterType: {value: "", owner: undefined, state: undefined}
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
        filterType: {value: "", owner: undefined, state: undefined}
      }
    default:
      return state;
  }
}