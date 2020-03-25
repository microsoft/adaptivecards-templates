import {
  LOGOUT,
  ACCESS_TOKEN_SET,
  GRAPH_ACCESS_TOKEN_SET,
  UserType,
  AuthAction,
  AccessTokenAction,
  GraphAccessTokenAction,
  GetUserDetailsAction,
  GetOrgDetailsAction,
  GetProfilePictureAction,
  GET_USER_DETAILS,
  GET_USER_DETAILS_SUCCESS,
  GET_USER_DETAILS_FAILURE,
  GET_ORG_DETAILS,
  GET_ORG_DETAILS_SUCCESS,
  GET_ORG_DETAILS_FAILURE,
  GET_PROFILE_PICTURE,
  GET_PROFILE_PICTURE_SUCCESS,
  GET_PROFILE_PICTURE_FAILURE,
} from './types';

import { getAuthenticatedClient } from '../../Services/GraphService';
import { AuthResponse } from 'msal';
import { RootState } from '../rootReducer';

export function logout(): AuthAction {
  return {
    type: LOGOUT,
    text: 'User logout'
  }
}

export function setGraphAccessToken(graphAccessToken: AuthResponse): GraphAccessTokenAction {
  return {
    type: GRAPH_ACCESS_TOKEN_SET,
    graphAccessToken
  }
}

export function setAccessToken(accessToken: AuthResponse): AccessTokenAction {
  return {
    type: ACCESS_TOKEN_SET, 
    accessToken
  }
}

function requestUserDetails(): GetUserDetailsAction {
  return {
    type: GET_USER_DETAILS,
  }
}

function requestUserDetailsSuccess(user: UserType): GetUserDetailsAction {
  return {
    type: GET_USER_DETAILS_SUCCESS,
    user,
  }
}

function requestUserDetailsFailure(): GetUserDetailsAction {
  return {
    type: GET_USER_DETAILS_FAILURE
  }
}

function requestOrgDetails(): GetOrgDetailsAction {
  return {
    type: GET_ORG_DETAILS
  }
}

function requestOrgDetailsSuccess(org: string): GetOrgDetailsAction {
  return {
    type: GET_ORG_DETAILS_SUCCESS,
    org,
  }
}

function requestOrgDetailsFailure(): GetOrgDetailsAction {
  return {
    type: GET_ORG_DETAILS_FAILURE
  }
}

function requestProfilePicture(): GetProfilePictureAction {
  return {
    type: GET_PROFILE_PICTURE
  }
}

function requestProfilePictureSuccess(imageURL: string): GetProfilePictureAction {
  return {
    type: GET_PROFILE_PICTURE_SUCCESS,
    imageURL
  }
}

function requestProfilePictureFailure(): GetProfilePictureAction {
  return {
    type: GET_PROFILE_PICTURE_FAILURE
  }
}

export function getUserDetails() {
  return function (dispatch: any, getState: () => RootState) {
    dispatch(requestUserDetails());
    const state = getState();

    if (!state.auth.graphAccessToken) {
      return dispatch(requestUserDetailsFailure());
    }

    const client = getAuthenticatedClient(state.auth.graphAccessToken);
    return client.api('/me').get()
      .then((userDetails: UserType) => {
        dispatch(requestUserDetailsSuccess(userDetails))
      }, (fail: any) => {
        dispatch(requestUserDetailsFailure());
      })
  }
}

export function getOrgDetails() {
  return function (dispatch: any, getState: () => RootState) {
    dispatch(requestOrgDetails());
    const state = getState();

    if (!state.auth.accessToken) {
      return dispatch(requestOrgDetailsFailure());
    }

    const client = getAuthenticatedClient(state.auth.accessToken);
    return client.api('/organization').get()
      .then((org: any) => {
        if (org.value.length === 0) {
          dispatch(requestOrgDetailsFailure());
        } else {
          dispatch(requestOrgDetailsSuccess(org.value[0].displayName));
        }
      }, (fail: any) => {
        dispatch(requestOrgDetailsFailure());
      })
  }
}

export function getProfilePicture() {
  return function (dispatch: any, getState: () => RootState) {
    dispatch(requestProfilePicture());
    const state = getState();

    if (!state.auth.graphAccessToken) {
      return dispatch(requestProfilePictureFailure());
    }

    const client = getAuthenticatedClient(state.auth.graphAccessToken);
    return client.api('/me/photos/240x240/$value').get()
      .then((image: Blob) => {
        const imageURL = URL.createObjectURL(image);
        dispatch(requestProfilePictureSuccess(imageURL));
      }, (fail: any) => {
        dispatch(requestProfilePictureFailure());
      })
  }
}
