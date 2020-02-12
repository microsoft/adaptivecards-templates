import { authReducer } from './auth/reducers';
import { searchReducer } from './search/reducer';
import { pageReducer } from './page/reducer';
import { designerReducer } from './designer/reducer';

import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
  auth: authReducer,
  search: searchReducer,
  page: pageReducer,
  designer: designerReducer
});

export type RootState = ReturnType<typeof rootReducer>;
