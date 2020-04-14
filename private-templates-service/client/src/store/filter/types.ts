import { PostedTemplate } from "adaptive-templating-service-typescript-node";

export interface FilterState {
  isFilter: boolean;
  filterType: {
    value: string,
    owner: boolean | undefined,
    published: FilterEnum
  };
}

export type FilterEnum =  "draft" | "live" | "deprecated" | undefined


//Action Types 
export const CLEAR_FILTER = "CLEAR_FILTER";
export const QUERY_FILTER = "QUERY_FILTER";

export type FilterObject =  {
  value: string,
  owner: boolean | undefined,
  published: FilterEnum
}

export interface FilterAction {
  type: typeof CLEAR_FILTER | typeof QUERY_FILTER;
  text: string;
  filterType: FilterObject;
}

