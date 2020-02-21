import {
  AuthState,
  AuthAction,
  UserType,
  AccessTokenAction,
  GetUserDetailsAction,
  GetOrgDetailsAction,
  GetProfilePictureAction,
  LOGOUT,
  ACCESS_TOKEN_SET,
  GET_USER_DETAILS,
  GET_USER_DETAILS_FAILURE,
  GET_USER_DETAILS_SUCCESS,
  GET_ORG_DETAILS,
  GET_ORG_DETAILS_FAILURE,
  GET_ORG_DETAILS_SUCCESS,
  GET_PROFILE_PICTURE,
  GET_PROFILE_PICTURE_FAILURE,
  GET_PROFILE_PICTURE_SUCCESS,
} from './types';

const initialState: AuthState = {
  isAuthenticated: false,
  user: undefined,
  isFetching: false,
  accessToken: undefined,
}

const initialUserState: UserType = {
  displayName: "",
  email: "",
}

function user(user = initialUserState, action: AuthAction | AccessTokenAction | GetUserDetailsAction | GetOrgDetailsAction | GetProfilePictureAction): UserType | undefined {
  switch (action.type) {
    case GET_USER_DETAILS_SUCCESS:
      return {
        ...user,
        ...action.user
      }
    case GET_ORG_DETAILS_SUCCESS:
      return {
        ...user,
        organization: action.org
      }
    case GET_PROFILE_PICTURE_SUCCESS:
      return {
        ...user,
        imageURL: action.imageURL,
      }
    default:
      return user;
  }
}

export function authReducer(state = initialState, action: AuthAction | AccessTokenAction | GetUserDetailsAction | GetOrgDetailsAction | GetProfilePictureAction): AuthState {
  switch (action.type) {
    case GET_USER_DETAILS:
    case GET_ORG_DETAILS:
    case GET_PROFILE_PICTURE:
      return {
        ...state,
        isFetching: true,
      };
    case GET_USER_DETAILS_FAILURE:
    case GET_ORG_DETAILS_FAILURE:
    case GET_PROFILE_PICTURE_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    case GET_USER_DETAILS_SUCCESS:
    case GET_ORG_DETAILS_SUCCESS:
    case GET_PROFILE_PICTURE_SUCCESS:
      return {
        ...state,
        user: user(state.user, action),
      }
    case ACCESS_TOKEN_SET:
      return {
        ...state,
        isAuthenticated: true,
        accessToken: action.accessToken,
      }
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: undefined,
        accessToken: undefined,
        isFetching: false,
      }
    default:
      return state;
  }
}
