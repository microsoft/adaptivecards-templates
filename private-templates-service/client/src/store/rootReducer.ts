import { authReducer } from './auth/reducers';
import { searchReducer } from './search/reducer';
import { pageReducer } from './page/reducer';
import { currentTemplateReducer } from './currentTemplate/reducers';

import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
  auth: authReducer,
  search: searchReducer,
  page: pageReducer,
  currentTemplate: currentTemplateReducer
});

export type RootState = ReturnType<typeof rootReducer>;
