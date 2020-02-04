import {SEARCH,SearchAction,CLEAR_SEARCH} from './types';


export function search(searchValue: string): SearchAction{

  return{
    type: SEARCH,
    text: 'User has pressed enter to Search',
    searchValue : searchValue

  }
}

export function clearSearch(): SearchAction{

  return{
    type: CLEAR_SEARCH,
    text: 'User has pressed esc or pressed the "X" to clear the search',
    searchValue : ""

  }
}