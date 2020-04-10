import { authReducer } from "./auth/reducers";
import { searchReducer } from "./search/reducer";
import { pageReducer } from "./page/reducer";
import { currentTemplateReducer } from "./currentTemplate/reducers";
import { filterReducer } from "./filter/reducer";
import { allTemplateReducer } from "./templates/reducer";
import { recentTemplatesReducer } from "./recentTemplates/reducer";
import { templateOwnerReducer } from "./templateOwner/reducers";
import { skipLinkReducer } from "./skiplink/reducer";
import { viewToggleReducer } from "./viewToggle/reducer";
import { tagsReducer } from "./tags/reducer";
import { sortReducer } from "./sort/reducer";

import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  auth: authReducer,
  search: searchReducer,
  page: pageReducer,
  currentTemplate: currentTemplateReducer,
  filter: filterReducer,
  sort: sortReducer,
  allTemplates: allTemplateReducer,
  recentTemplates: recentTemplatesReducer,
  templateOwner: templateOwnerReducer,
  skipLink: skipLinkReducer,
  allCardsViewToggle: viewToggleReducer,
  tags: tagsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
