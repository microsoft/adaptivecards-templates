export interface AuthState {
  isAuthenticated: boolean;
  user?: UserType;
}

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
export interface AuthAction {
  type: typeof LOGIN | typeof LOGOUT;
  text: string;
  user?: UserType;
}
