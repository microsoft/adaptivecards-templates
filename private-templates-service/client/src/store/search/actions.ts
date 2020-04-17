import {
  QUERY_SEARCH_BEGIN,
  QUERY_SEARCH_SUCCESS,
  QUERY_SEARCH_FAILURE,
  SearchAction,
  CLEAR_SEARCH,
  SET_SEARCHBAR_VISIBLE
} from './types';

import { SortType } from '../sort/types';
import { IncomingMessage } from 'http';
import { RootState } from '../rootReducer';
import { initClientSDK } from '../../utils/TemplateUtil';
import { FilterEnum } from '../filter/types'

export function querySearchBegin(): SearchAction {
  return {
    type: QUERY_SEARCH_BEGIN,
    searchByTemplateName: ""
  }
}

export function querySearchSuccess(cards: any, searchByTemplateName: string): SearchAction {
  return {
    type: QUERY_SEARCH_SUCCESS,
    cards: cards,
    searchByTemplateName: searchByTemplateName
  }
}

export function querySearchFailure(error: IncomingMessage): SearchAction {
  return {
    type: QUERY_SEARCH_FAILURE,
    searchByTemplateName: "",
    error: error
  }
}

export function querySearch(searchByTemplateName: string, sortValue?: SortType, state?: FilterEnum, owned?: boolean ): (dispatch: any, getState: () => RootState) => void {
  return function (dispatch: any, getState: () => RootState) {
    dispatch(querySearchBegin())
    const api = initClientSDK(dispatch, getState);
    return api.allTemplates(state, true, searchByTemplateName, undefined, owned, sortValue, undefined, [searchByTemplateName] )
      .then(response => {
        if (response.response && response.response.statusCode === 200) {
          dispatch(querySearchSuccess(response.body, searchByTemplateName));
        }
        else {
          dispatch(querySearchFailure(response.response));
        }
      })
      .catch(response => {
        dispatch(querySearchFailure(response.response));
      })
  }
}

export function clearSearch(): SearchAction {
  return {
    type: CLEAR_SEARCH,
    searchByTemplateName: undefined
  }
}

export function setSearchBarVisible(isSearchBarVisible: boolean) {
  return {
    type: SET_SEARCHBAR_VISIBLE,
    text: 'set the searchbar visibility state',
    searchValue: "",
    isSearchBarVisible: isSearchBarVisible
  }
}
