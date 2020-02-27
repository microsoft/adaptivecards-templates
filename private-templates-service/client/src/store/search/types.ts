import { TemplateList } from "adaptive-templating-service-typescript-node";
import { IncomingMessage } from "http";

export interface SearchState {
  isSearch: boolean;
  searchByTemplateName: string;
  templates?: TemplateList;
  loading: boolean;
  error?: IncomingMessage;
}

// Action Types 
export const QUERY_SEARCH_BEGIN = 'QUERY_SEARCH BEGIN';
export const QUERY_SEARCH_SUCCESS = "QUERY SEARCH SUCCESS";
export const QUERY_SEARCH_FAILURE = "QUERY SEARCH FAILURE";
export const CLEAR_SEARCH = 'CLEAR_SEARCH';

// Actions
export interface SearchAction {
  type: typeof QUERY_SEARCH_BEGIN |
  typeof QUERY_SEARCH_SUCCESS |
  typeof QUERY_SEARCH_FAILURE |
  typeof CLEAR_SEARCH;
  searchByTemplateName: string;
  cards?: TemplateList;
  error?: IncomingMessage;
}
