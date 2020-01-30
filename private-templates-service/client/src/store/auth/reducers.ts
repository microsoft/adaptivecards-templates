import {
  AuthState,
  AuthAction,
  LOGIN,
  LOGOUT,
} from './types';

const initialState: AuthState = {
  isAuthenticated: false,
  user: undefined,
}

export function authReducer(state = initialState, action: AuthAction): AuthState {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.user
      }

    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: undefined
      }
    default:
      return state;
  }
}
