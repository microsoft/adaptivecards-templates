import {
  PageState,
  NAVIGATION,
  PageAction
} from './types';

const initalState: PageState = {
  currentPage: ""
}

export function pageReducer( state = initalState, action: PageAction): PageState{
  switch(action.type){
    case NAVIGATION:
      return{
      ...state,
      currentPage: action.currentPage
    }
    default:
      return state;
  }
}
