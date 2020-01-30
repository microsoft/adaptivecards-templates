import { LOGIN, LOGOUT, AuthTypes } from './types';

export function login(user: any): AuthTypes {
  return {
    type: LOGIN,
    text: 'User login',
    user: user
  }
}

export function logout(): AuthTypes {
  return {
    type: LOGOUT,
    text: 'User Logout'
  }
}
