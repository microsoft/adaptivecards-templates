export interface FilterState {
  isFilter: boolean;
  filterType: string;
}

//Action Types 
export const CLEAR_FILTER = "CLEAR_FILTER";
export const QUERY_FILTER = "QUERY_FILTER";

export interface FilterAction {
  type: typeof CLEAR_FILTER | typeof QUERY_FILTER;
  text: string;
  filterType: string;
}

