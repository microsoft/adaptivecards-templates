import {
  TemplateList
} from "adaptive-templating-service-typescript-node";
import {
  REQUEST_RECENT_TEMPLATES_GET,
  REQUEST_RECENT_TEMPLATES_GET_SUCCESS,
  REQUEST_RECENT_TEMPLATES_GET_FAIL,
  RecentTemplatesAction
} from "./types";
import { RootState } from "../rootReducer";
import { IncomingMessage } from "http";
import { initClientSDK } from "../../utils/TemplateUtil";

export function requestRecentTemplates(): RecentTemplatesAction {
  return {
    type: REQUEST_RECENT_TEMPLATES_GET
  };
}

export function requestRecentTemplatesSuccess(
  recentlyEdited: TemplateList,
  recentlyViewed: TemplateList
): RecentTemplatesAction {
  return {
    type: REQUEST_RECENT_TEMPLATES_GET_SUCCESS,
    recentlyEdited: recentlyEdited,
    recentlyViewed: recentlyViewed
  };
}

export function requestRecentTemplatesFailure(
  error: IncomingMessage
): RecentTemplatesAction {
  return {
    type: REQUEST_RECENT_TEMPLATES_GET_FAIL,
    error: error
  };
}

export function getRecentTemplates() {
  return function (dispatch: any, getState: () => RootState) {
    dispatch(requestRecentTemplates());
    const api = initClientSDK(dispatch, getState);
    return api.getRecent().then(response => {
      if (response.response.statusCode && response.response.statusCode === 200) {
        if (response.body.recentlyEdited && response.body.recentlyViewed) {
          dispatch(
            requestRecentTemplatesSuccess(
              response.body.recentlyEdited,
              response.body.recentlyViewed
            )
          );
        } else {
          dispatch(requestRecentTemplatesFailure(response.response));
        }
      } else {
        dispatch(requestRecentTemplatesFailure(response.response));
      }
    });
  };
}
