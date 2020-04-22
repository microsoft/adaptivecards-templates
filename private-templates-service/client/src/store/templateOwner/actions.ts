import {
  GetOwnerNameAction,
  GetOwnerProfilePictureAction,
  GET_OWNER_NAME,
  GET_OWNER_NAME_SUCCESS,
  GET_OWNER_NAME_FAILURE,
  GET_OWNER_PROFILE_PICTURE,
  GET_OWNER_PROFILE_PICTURE_SUCCESS,
  GET_OWNER_PROFILE_PICTURE_FAILURE,
} from './types';

import { getAuthenticatedClient } from '../../Services/GraphService';
import { RootState } from '../rootReducer';

function requestOwnerName(): GetOwnerNameAction {
  return {
    type: GET_OWNER_NAME,
  }
}

function requestOwnerNameSuccess(ownerName: string, index: string): GetOwnerNameAction {
  return {
    type: GET_OWNER_NAME_SUCCESS,
    ownerName,
    index,
  }
}

function requestOwnerNameFailure(): GetOwnerNameAction {
  return {
    type: GET_OWNER_NAME_FAILURE,
  }
}

function requestOwnerProfilePicture(): GetOwnerProfilePictureAction {
  return {
    type: GET_OWNER_PROFILE_PICTURE,
  }
}

function requestOwnerProfilePictureSuccess(ownerImageURL: string, index: string): GetOwnerProfilePictureAction {
  return {
    type: GET_OWNER_PROFILE_PICTURE_SUCCESS,
    ownerImageURL,
    index,
  }
}

function requestOwnerProfilePictureFailure(): GetOwnerProfilePictureAction {
  return {
    type: GET_OWNER_PROFILE_PICTURE_FAILURE
  }
}

export function getOwnerName(oID: string) {
  return function (dispatch: any, getState: () => RootState) {
    dispatch(requestOwnerName());
    const state = getState();

    if (!state.auth.graphAccessToken) {
      return dispatch(requestOwnerNameFailure());
    }
    const client = getAuthenticatedClient(state.auth.graphAccessToken);
    return client.api('/users/' + oID + '/displayName').get()
      .then((name: any) => {
        if (!name.value) {
          dispatch(requestOwnerNameFailure());
        } else {
          dispatch(requestOwnerNameSuccess(name.value, oID));
        }
      }, (fail: any) => {
        dispatch(requestOwnerNameFailure());
      })
  }
}

export function getOwnerProfilePicture(oID: string) {
  return function (dispatch: any, getState: () => RootState) {
    dispatch(requestOwnerProfilePicture());
    const state = getState();

    if (!state.auth.graphAccessToken) {
      return dispatch(requestOwnerProfilePictureFailure());
    }

    const client = getAuthenticatedClient(state.auth.graphAccessToken);
    return client.api('/users/' + oID + '/photo/$value').get()
      .then((image: Blob) => {
        const imageURL = URL.createObjectURL(image);
        dispatch(requestOwnerProfilePictureSuccess(imageURL, oID));
      }, (fail: any) => {
        // if user doesn't have a custom profile picture
        if (oID && fail.statusCode && fail.statusCode === 404) {
          dispatch(requestOwnerProfilePictureSuccess("-1", oID))
        }
        dispatch(requestOwnerProfilePictureFailure());
      })
  }
}
