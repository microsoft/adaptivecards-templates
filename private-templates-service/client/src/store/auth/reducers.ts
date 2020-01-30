import { UserType } from './types';

import {
  AuthTypes,
  LOGIN,
  LOGOUT,
} from './types';

export function isAuthenticatedReducer(state = false, action: AuthTypes): Boolean {
  switch (action.type) {
    case LOGIN:
      return true;
    case LOGOUT:
      return false;
    default:
      return state;
  }
}

export function userReducer(state = {}, action: AuthTypes): UserType | {} {
  console.log("user", state, action);
  switch (action.type) {
    case LOGIN:
      return action.user;
    case LOGOUT:
      return {}
    default:
      return state;
  }
}
