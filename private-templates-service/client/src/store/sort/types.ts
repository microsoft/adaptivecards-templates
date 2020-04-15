export interface SortState {
  isSort: boolean;
  sortType: "alphabetical" | "dateCreated" | "dateUpdated" | undefined
}

export const CLEAR_SORT = "CLEAR_SORT";
export const QUERY_SORT = "QUERY_SORT";

export type SortType = "alphabetical" | "dateCreated" | "dateUpdated" | undefined


export interface SortAction {
  type: typeof CLEAR_SORT | typeof QUERY_SORT;
  text: string;
  sortType: SortType;
}
