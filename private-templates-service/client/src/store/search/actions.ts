import {
  QUERY_SEARCH_BEGIN,
  QUERY_SEARCH_SUCCESS,
  QUERY_SEARCH_FAILURE,
  SearchAction,
  CLEAR_SEARCH,
  SET_SEARCHBAR_VISIBLE
} from './types';

import { IncomingMessage } from 'http';
import { TemplateApi } from 'adaptive-templating-service-typescript-node';
import { RootState } from '../rootReducer';
import { initClientSDK } from '../../utils/TemplateUtil/TemplateUtil';

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

export function querySearch(searchByTemplateName: string): (dispatch: any, getState: () => RootState) => void {
  return function (dispatch: any, getState: () => RootState) {
    const appState = getState();
    dispatch(querySearchBegin())
    
    const api = initClientSDK(dispatch, getState);
    
    return api.allTemplates(undefined, true, searchByTemplateName)
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
    searchByTemplateName: ""
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
