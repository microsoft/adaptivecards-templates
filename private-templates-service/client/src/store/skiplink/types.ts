export const SET_SKIP_LINK_CONTENT_ID = "SET_SKIP_LINK_CONTENT_ID";

export interface SkipLinkState {
  contentID: string;
}

export interface SkipLinkAction {
  type: typeof SET_SKIP_LINK_CONTENT_ID;
  contentID: string;
}
