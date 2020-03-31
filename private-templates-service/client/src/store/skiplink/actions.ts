import { SET_SKIP_LINK_CONTENT_ID, SkipLinkAction } from "./types";

export function setSkipLinkContentID(id: string): SkipLinkAction {
  return {
    type: SET_SKIP_LINK_CONTENT_ID,
    contentID: id
  };
}
