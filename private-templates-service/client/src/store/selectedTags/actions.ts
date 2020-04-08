import { ADD_SELECTED_TAG, REMOVE_SELECTED_TAG, CLEAR_SELECTED_TAGS, SelectedTagsAction } from "./types";

export function addSelectedTag(tag:string): SelectedTagsAction {
  return {
    type: ADD_SELECTED_TAG,
    tag: tag
  }
}

export function removeSelectedTag(tag: string) {
  return {
    type: REMOVE_SELECTED_TAG,
    tag: tag
  }
}

export function clearSelectedTags() {
  return {
    type: CLEAR_SELECTED_TAGS
  }
}

