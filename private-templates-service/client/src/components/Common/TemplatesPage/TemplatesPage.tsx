// React
import React, { Component} from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { StaticContext } from "react-router"
// Store
import { RootState } from "../../../store/rootReducer";
import { addSelectedTag, removeSelectedTag, clearSelectedTags, removeFavoriteTags, addFavoriteTags } from "../../../store/tags/actions";
import { TagsState } from "../../../store/tags/types";
import { ViewType } from "../../../store/viewToggle/types";
import { setViewToggleType } from "../../../store/viewToggle/actions";
import { setPage } from "../../../store/page/actions";
import { PageState } from "../../../store/page/types";
import { SortType } from "../../../store/sort/types";
import { FilterEnum, FilterObject } from "../../../store/filter/types";
// Components
import { setSearchBarVisible } from "../../../store/search/actions";
import { Title } from "../../Dashboard/styled";
import { InnerCardsContainer, OuterCardsContainer, UpperBar, ViewHelperBar } from "./styled";
import ToggleButton from "./ToggleButton";
import TemplatesView from "./TemplatesView";
import Sort from "../../Dashboard/SearchPage/Sort";
import Filter from "../../Dashboard/SearchPage/Filter";
// Strings
import { LIST_VIEW, GRID_VIEW } from "../../../assets/strings";
import TagList from "./TagList";
import { COLORS } from "../../../globalStyles";
// Util
import { ScrollDirection } from "../../../utils/AllCardsUtil";
import { TooltipHost } from "office-ui-fabric-react";
import { SearchState } from "../../../store/search/types";

const mapStateToProps = (state: RootState) => {
  return {
    tags: state.tags,
    page: state.page,
    filter: state.filter.filterType,
    search: state.search,
    sort: state.sort.sortType
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    setPage: (currentPageTitle: string, currentPage: string) => {
      dispatch(setPage(currentPageTitle, currentPage));
    },
    setSearchBarVisible: (isSearchBarVisible: boolean) => {
      dispatch(setSearchBarVisible(isSearchBarVisible));
    },
    toggleView: (viewType: ViewType) => {
      dispatch(setViewToggleType(viewType));
    },
    addSelectedTag: (tag: string) => {
      dispatch(addSelectedTag(tag));
    },
    removeSelectedTag: (tag: string) => {
      dispatch(removeSelectedTag(tag));
    },
    clearSelectedTags: () => {
      dispatch(clearSelectedTags());
    },
    onAddFavoriteTag: (tag: string) => {
      dispatch(addFavoriteTags(tag))
    },
    onRemoveFavoriteTag: (tag: string) => {
      dispatch(removeFavoriteTags(tag))
    }
  };
};

interface HistoryState {
  redirect?: boolean;
}

interface Props extends RouteComponentProps<{}, StaticContext, HistoryState> {
  setPage: (currentPageTitle: string, currentPage: string) => void;
  setSearchBarVisible: (isSearchBarVisible: boolean) => void;
  toggleView: (viewType: ViewType) => void;
  getTags: () => void;
  getTemplates: (tags?: string[], ifOwned?: boolean, name?: string, sortBy?: SortType, filterState?: FilterEnum) => void;
  addSelectedTag: (tag: string) => void;
  removeSelectedTag: (tag: string) => void;
  clearSelectedTags: () => void;
  onAddFavoriteTag: (tag: string) => void;
  onRemoveFavoriteTag: (tag: string) => void;
  pageTitle: string;
  pageID: string;
  // basePath: string;
  search: SearchState;
  filter: FilterObject;
  sort: SortType;
  tags: TagsState;
  page: PageState;
  basePath: string;
}

interface State {
  selectedTags: string[];
}
class TemplatesPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.props.setPage(props.pageTitle, props.pageID);
    this.props.setSearchBarVisible(true);
    this.setSelectedTags();
  }

  setSelectedTags = (): void => {
    const { currentPage, previousPage } = this.props.page;
    const { pageID } = this.props;
    const { location } = this.props.history;
    if (currentPage === "Template" && previousPage === pageID || location.state && location.state.redirect) {
      this.state = { selectedTags: this.props.tags.selectedTags };
    } else {
      this.props.clearSelectedTags();
      this.state = { selectedTags: [] };
    }
  };

  tagOnClick = (tag: string): void => {
    this.setState((state) => {
      if (state.selectedTags.includes(tag)) {
        this.props.removeSelectedTag(tag);
        return { selectedTags: state.selectedTags.filter((selectedTag: string) => selectedTag !== tag) };
      } else {
        this.props.addSelectedTag(tag);
        return { selectedTags: state.selectedTags.concat(tag) };
      }
    });
    // this.props.history.replace()
  };
  tagToggleStyle = (isSelected: boolean, ref: any) => {
    if (!isSelected) {
      ref.current.style.background = COLORS.BLUE;
      ref.current.style.color = COLORS.WHITE;
    } else {
      ref.current.style.background = COLORS.GREY2;
      ref.current.style.color = COLORS.BLACK;
    }
  };
  componentDidMount() {
    this.props.getTags();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.search.isSearch !== prevProps.search.isSearch) {
      if (this.props.search.isSearch) {
        this.props.setPage(this.props.pageTitle, "searchPage");
      } else {
        this.props.setPage(this.props.pageTitle, this.props.pageID);
      }
    }
  }

  selectTemplate = (templateID: string) => {
    this.props.history.push("/preview/" + templateID);
  };

  render() {
    let tagsState: TagsState = this.props.tags;
    let allTags: string[] = [];
    let favoriteTags: string[] = [];
    if (!tagsState.isFetching && tagsState.allTags) {
      if(tagsState.allTags.allTags) {
        allTags = tagsState.allTags.allTags
      }
      if(tagsState.allTags.favoriteTags) {
        favoriteTags = tagsState.allTags.favoriteTags;
      }
    }
    let listTooltip = "listTooltip";
    let gridTooltip = "gridTooltip";

    return (
      <OuterCardsContainer>
        <InnerCardsContainer>
          <UpperBar aria-label={this.props.pageTitle + " controls"}>
            <Title>{this.props.pageTitle}</Title>
            <ViewHelperBar>
              <TooltipHost id={listTooltip} content={LIST_VIEW}>
                <ToggleButton iconProps={{ iconName: "BulletedList" }} onClick={this.props.toggleView} viewType={ViewType.List} title={LIST_VIEW} />
              </TooltipHost>
              <TooltipHost id={gridTooltip} content={GRID_VIEW}>
                <ToggleButton iconProps={{ iconName: "GridViewMedium" }} onClick={this.props.toggleView} viewType={ViewType.Grid} title={GRID_VIEW} />
              </TooltipHost>
              <Sort />
              <Filter />
            </ViewHelperBar>
          </UpperBar>
          <TagList tags={allTags} selectedTags={this.state.selectedTags} allowEdit={false} favoriteTags={favoriteTags} onClick={this.tagOnClick} toggleStyle={this.tagToggleStyle} direction={ScrollDirection.Horizontal} allowSetFavorite={true} onAddFavoriteTag={this.props.onAddFavoriteTag} onRemoveFavoriteTag={this.props.onRemoveFavoriteTag}/>
          <TemplatesView onClick={this.selectTemplate} selectedTags={this.state.selectedTags} getTemplates={this.props.getTemplates} basePath={this.props.basePath}/>
        </InnerCardsContainer>
      </OuterCardsContainer>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TemplatesPage));
