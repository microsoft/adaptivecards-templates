import { isAuthenticatedReducer, userReducer } from './auth/reducers';
import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
  isAuthenticated: isAuthenticatedReducer,
  user: userReducer
})

export type RootState = ReturnType<typeof rootReducer>;
