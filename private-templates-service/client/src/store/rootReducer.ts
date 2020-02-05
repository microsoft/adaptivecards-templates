import { authReducer } from './auth/reducers';
import { searchReducer } from './search/reducer';
import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
  auth: authReducer,
  search: searchReducer,
})

export type RootState = ReturnType<typeof rootReducer>;
