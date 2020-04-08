import { REQUEST_TAGS_GET, REQUEST_TAGS_GET_SUCCESS, REQUEST_TAGS_GET_FAIL, AllTagsAction } from "./types";
import { TagList } from 'adaptive-templating-service-typescript-node';
import { IncomingMessage, request } from "http";
import { RootState } from "../rootReducer";
import { initClientSDK } from "../../utils/TemplateUtil";

export function requestAllTags(): AllTagsAction {
  return {
    type: REQUEST_TAGS_GET
  }
}

export function receiveAllTags(tags: TagList): AllTagsAction {
  return {
    type: REQUEST_TAGS_GET_SUCCESS,
    tags: tags
  }
}

export function failGetAllTags(error: IncomingMessage): AllTagsAction {
  return {
    type: REQUEST_TAGS_GET_FAIL,
    error: error
  }
}
export function getAllTags() {
  return function (dispatch: any, getState: () => RootState) {
    dispatch(requestAllTags());
    const api = initClientSDK(dispatch, getState);
    return api.allTags()
      .then(response => {
        if (response.response.statusCode && response.response.statusCode === 200) {
          dispatch(receiveAllTags(response.body));
        } else {
          dispatch(failGetAllTags(response.response));
        }
      })
      .catch(response => {
        dispatch(failGetAllTags(response.response));
      })
  }
}
