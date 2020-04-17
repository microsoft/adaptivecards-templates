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
  GetConfigAction,
  GET_USER_DETAILS,
  GET_USER_DETAILS_SUCCESS,
  GET_USER_DETAILS_FAILURE,
  GET_ORG_DETAILS,
  GET_ORG_DETAILS_SUCCESS,
  GET_ORG_DETAILS_FAILURE,
  GET_PROFILE_PICTURE,
  GET_PROFILE_PICTURE_SUCCESS,
  GET_PROFILE_PICTURE_FAILURE,
  GET_CONFIG,
  GET_CONFIG_SUCCESS,
  GET_CONFIG_FAILURE
} from './types';

import { getAuthenticatedClient } from '../../Services/GraphService';
import { AuthResponse } from 'msal';
import { RootState } from '../rootReducer';
import { ConfigApi } from 'adaptive-templating-service-typescript-node';

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

function requestConfig(): GetConfigAction {
  return {
    type: GET_CONFIG
  }
}

function requestConfigSuccess(appId: string, redirectUri: string, appInsightsInstrumentationKey: string, userInsightsInstrumentationKey: string): GetConfigAction {
  return {
    type: GET_CONFIG_SUCCESS,
    redirectUri,
    appId,
    appInsightsInstrumentationKey,
    userInsightsInstrumentationKey,
  }
}

function requestConfigFailure(): GetConfigAction {
  return {
    type: GET_CONFIG_FAILURE
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

    if (!state.auth.graphAccessToken) {
      return dispatch(requestOrgDetailsFailure());
    }

    const client = getAuthenticatedClient(state.auth.graphAccessToken);
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

export function getConfig() {
  return function (dispatch: any) {
    const api = new ConfigApi(window.location.origin);

    dispatch(requestConfig());
    return api.configGet().then((response: any) => {
      if (response.response.statusCode && response.response.statusCode === 200) {
        dispatch(requestConfigSuccess(response.body.appId, response.body.redirectUri, response.body.appInsightsInstrumentationKey, response.body.userInsightsInstrumentationKey));
      } else {
        dispatch(requestConfigFailure());
      }
    }).catch((error: any) => {
      dispatch(requestConfigFailure());
    })
  }
}
