import { authReducer } from './auth/reducers';
import { searchReducer } from './search/reducer';
import { pageReducer } from './page/reducer';
import { filterReducer } from './filter/reducer'; 
import { combineReducers } from 'redux';
import { sortReducer } from './sort/reducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  search: searchReducer,
  page: pageReducer,
  filter: filterReducer,
  sort: sortReducer
})

export type RootState = ReturnType<typeof rootReducer>;
