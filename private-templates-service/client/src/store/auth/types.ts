import { AuthResponse } from "msal";

export interface AuthState {
  isAuthenticated: boolean;
  user?: UserType;
  isFetching: boolean;
  accessToken?: AuthResponse;
}

export interface UserType {
  displayName: string;
  email: string;
  organization?: string;
  imageURL?: string;
}

// Action Types
export const ACCESS_TOKEN_SET = 'ACCESS_TOKEN_SET';

export const GET_USER_DETAILS = 'GET_USER_DETAILS';
export const GET_USER_DETAILS_SUCCESS = 'GET_USER_DETAILS_SUCCESS';
export const GET_USER_DETAILS_FAILURE = 'GET_USER_DETAILS_FAILURE';

export const GET_ORG_DETAILS = 'GET_ORG_DETAILS';
export const GET_ORG_DETAILS_SUCCESS = 'GET_ORG_DETAILS_SUCCESS';
export const GET_ORG_DETAILS_FAILURE = 'GET_ORG_DETAILS_FAILURE';

export const GET_PROFILE_PICTURE = 'GET_PROFILE_PICTURE';
export const GET_PROFILE_PICTURE_SUCCESS = 'GET_PROFILE_PICTURE_SUCCESS';
export const GET_PROFILE_PICTURE_FAILURE = 'GET_PROFILE_PICTURE_FAILURE';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const LOGIN_POPUP_BEGIN = 'LOGIN_POPUP_BEGIN';
export const LOGIN_POPUP_FAIL = 'LOGIN_POPUP_FAIL';
export const LOGIN_POPUP_SUCCESS = 'LOGIN_POPUP_SUCCESS';

// Actions
export interface AuthAction {
  type: typeof LOGOUT;
  text: string;
  user?: UserType;
}

export interface GetUserDetailsAction {
  type: typeof GET_USER_DETAILS | typeof GET_USER_DETAILS_SUCCESS | typeof GET_USER_DETAILS_FAILURE;
  user?: UserType;
}

export interface GetOrgDetailsAction {
  type: typeof GET_ORG_DETAILS | typeof GET_ORG_DETAILS_SUCCESS | typeof GET_ORG_DETAILS_FAILURE;
  org?: string;
}

export interface GetProfilePictureAction {
  type: typeof GET_PROFILE_PICTURE | typeof GET_PROFILE_PICTURE_SUCCESS | typeof GET_PROFILE_PICTURE_FAILURE;
  imageURL?: string;
}

export interface AccessTokenAction {
  type: typeof ACCESS_TOKEN_SET;
  accessToken: AuthResponse;
}
