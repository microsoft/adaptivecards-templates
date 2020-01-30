export interface UserType {
  displayName: string;
  email: string;
  organization?: string;
  avatar?: string;
}

// Action Types
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

// Actions
interface LoginAction {
  type: typeof LOGIN;
  text: string;
  user: UserType;
}

interface LogoutAction {
  type: typeof LOGOUT;
  text: string;
}

export type AuthTypes = LoginAction | LogoutAction;
