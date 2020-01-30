import { LOGIN, LOGOUT, UserType, AuthAction } from './types';

export function login(user: UserType): AuthAction {
  return {
    type: LOGIN,
    text: 'User login',
    user: user
  }
}

export function logout(): AuthAction {
  return {
    type: LOGOUT,
    text: 'User logout'
  }
}
