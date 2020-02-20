export interface SortState {
  isSort: boolean;
  sortType: string;
}

export const CLEAR_SORT = "CLEAR_SORT";
export const QUERY_SORT = "QUERY_SORT";

export interface SortAction {
  type: typeof CLEAR_SORT | typeof QUERY_SORT;
  text: string;
  sortType: string;
}
