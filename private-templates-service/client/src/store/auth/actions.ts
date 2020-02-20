import {
  LOGIN,
  LOGOUT,
  LOGIN_POPUP_BEGIN,
  LOGIN_POPUP_FAIL,
  LOGIN_POPUP_SUCCESS,
  UserType,
  AuthAction,
  LoginPopupAction
} from './types';

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

export function loginPopupBegin(): LoginPopupAction {
  return {
    type: LOGIN_POPUP_BEGIN
  }
}

export function loginPopupFail(): LoginPopupAction {
  return {
    type: LOGIN_POPUP_FAIL
  }
}

export function loginPopupSucess(): LoginPopupAction {
  return {
    type: LOGIN_POPUP_SUCCESS
  }
}

export function loginPopup(): (dispatch: any) => void {

  return function (dispatch: any) {
    dispatch(loginPopupBegin());


  }
}
