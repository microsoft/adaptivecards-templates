import { authReducer } from './auth/reducers';
import { searchReducer } from './search/reducer';
import { pageReducer } from './page/reducer';
import { allTemplateReducer } from './templates/reducer';
import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
  auth: authReducer,
  search: searchReducer,
  page: pageReducer,
  templates: allTemplateReducer
})

export type RootState = ReturnType<typeof rootReducer>;

