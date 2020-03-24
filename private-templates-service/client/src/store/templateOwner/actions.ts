import {
  GetOwnerNameAction,
  GetOwnerProfilePictureAction,
  ClearOwnersAction,
  GET_OWNER_NAME,
  GET_OWNER_NAME_SUCCESS,
  GET_OWNER_NAME_FAILURE,
  GET_OWNER_PROFILE_PICTURE,
  GET_OWNER_PROFILE_PICTURE_SUCCESS,
  GET_OWNER_PROFILE_PICTURE_FAILURE,
  CLEAR_OWNERS,
} from './types';

import { getAuthenticatedClient } from '../../Services/GraphService';
import { RootState } from '../rootReducer';

function requestOwnerName(): GetOwnerNameAction {
  return {
    type: GET_OWNER_NAME,
  }
}

function requestOwnerNameSuccess(ownerName: string, index: number): GetOwnerNameAction {
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

function requestOwnerProfilePictureSuccess(ownerImageURL: string, index: number): GetOwnerProfilePictureAction {
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

export function ClearOwners(): ClearOwnersAction {
  console.log("clear");
  return {
    type: CLEAR_OWNERS,
  }
}

export function getOwnerName(oID: string, index: number) {
  return function (dispatch: any, getState: () => RootState) {
    dispatch(requestOwnerName());
    const state = getState();

    if (!state.auth.accessToken) {
      return dispatch(requestOwnerNameFailure());
    }
    const client = getAuthenticatedClient(state.auth.accessToken);
    return client.api('/users/' + oID + '/displayName').get()
      .then((name: any) => {
        if (!name.value) {
          dispatch(requestOwnerNameFailure());
        } else {
          dispatch(requestOwnerNameSuccess(name.value, index));
        }
      }, (fail: any) => {
        dispatch(requestOwnerNameFailure());
      })
  }
}

export function getOwnerProfilePicture(oID: string, index: number) {
  return function (dispatch: any, getState: () => RootState) {
    dispatch(requestOwnerProfilePicture());
    const state = getState();

    if (!state.auth.accessToken) {
      return dispatch(requestOwnerProfilePictureFailure());
    }

    const client = getAuthenticatedClient(state.auth.accessToken);
    return client.api('/users/' + oID + '/photo/$value').get()
      .then((image: Blob) => {
        const imageURL = URL.createObjectURL(image);
        dispatch(requestOwnerProfilePictureSuccess(imageURL, index));
      }, (fail: any) => {
        dispatch(requestOwnerProfilePictureFailure());
      })
  }
}
