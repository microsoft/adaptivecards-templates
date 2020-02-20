export interface AuthState {
  isAuthenticated: boolean;
  user?: UserType;
}

export interface UserType {
  displayName: string;
  email: string;
  organization?: string;
  avatarURL?: string;
}

// Action Types
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const LOGIN_POPUP_BEGIN = 'LOGIN_POPUP_BEGIN';
export const LOGIN_POPUP_FAIL = 'LOGIN_POPUP_FAIL';
export const LOGIN_POPUP_SUCCESS = 'LOGIN_POPUP_SUCCESS';

// Actions
export interface AuthAction {
  type: typeof LOGIN | typeof LOGOUT;
  text: string;
  user?: UserType;
}

export interface LoginPopupAction {
  type: typeof LOGIN_POPUP_BEGIN | typeof LOGIN_POPUP_FAIL | typeof LOGIN_POPUP_SUCCESS;
}
