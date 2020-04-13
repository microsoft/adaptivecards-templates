// React
import React, { Component } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
// Store
import { RootState } from "../../../store/rootReducer";
import { addSelectedTag, removeSelectedTag, clearSelectedTags } from "../../../store/tags/actions";
import { TagsState } from "../../../store/tags/types";
import { ViewType } from "../../../store/viewToggle/types";
import { setViewToggleType } from "../../../store/viewToggle/actions";
import { setPage } from "../../../store/page/actions";
import { PageState } from "../../../store/page/types";
// Components
import { setSearchBarVisible } from "../../../store/search/actions";
import { Title } from "../../Dashboard/styled";
import { InnerCardsContainer, OuterCardsContainer, UpperBar, ViewHelperBar } from "./styled";
import ToggleButton from "./ToggleButton";
import TemplatesView from "./TemplatesView";
import Sort from "../../Dashboard/SearchPage/Sort";
import Filter from "../../Dashboard/SearchPage/Filter";
import SearchPage from "../../Dashboard/SearchPage";
// Strings
import { LIST_VIEW, GRID_VIEW } from "../../../assets/strings";
import TagList from "./TagList";
import { COLORS } from "../../../globalStyles";

const mapStateToProps = (state: RootState) => {
  return {
    isSearch: state.search.isSearch,
    tags: state.tags,
    page: state.page,
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
  };
};
interface Props extends RouteComponentProps {
  setPage: (currentPageTitle: string, currentPage: string) => void;
  setSearchBarVisible: (isSearchBarVisible: boolean) => void;
  toggleView: (viewType: ViewType) => void;
  getTags: () => void;
  getTemplates: (tags?: string[]) => void;
  addSelectedTag: (tag: string) => void;
  removeSelectedTag: (tag: string) => void;
  clearSelectedTags: () => void;
  pageTitle: string;
  pageID: string;
  isSearch: boolean;
  tags: TagsState;
  page: PageState;
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
    if (this.props.page.currentPage === "Template" && this.props.page.previousPage === this.props.pageID) {
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
    if (this.props.isSearch !== prevProps.isSearch) {
      if (this.props.isSearch) {
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
    if (this.props.isSearch) {
      return (
        <InnerCardsContainer>
          <SearchPage selectTemplate={this.selectTemplate} />
        </InnerCardsContainer>
      );
    }
    let tagsState: TagsState = this.props.tags;
    let allTags: string[] = [];
    if (!tagsState.isFetching && tagsState.allTags && tagsState.allTags.allTags) {
      allTags = tagsState.allTags?.allTags;
    }

    return (
      <OuterCardsContainer>
        <InnerCardsContainer>
          <UpperBar>
            <Title>{this.props.pageTitle}</Title>
            <ViewHelperBar>
              <ToggleButton iconProps={{ iconName: "BulletedList" }} onClick={this.props.toggleView} viewType={ViewType.List} title={LIST_VIEW} />
              <ToggleButton iconProps={{ iconName: "GridViewMedium" }} onClick={this.props.toggleView} viewType={ViewType.Grid} title={GRID_VIEW} />
              <Sort />
              <Filter />
            </ViewHelperBar>
          </UpperBar>
          <TagList tags={allTags} selectedTags={this.state.selectedTags} allowEdit={false} onClick={this.tagOnClick} toggleStyle={this.tagToggleStyle} />
          <TemplatesView onClick={this.selectTemplate} selectedTags={this.state.selectedTags} getTemplates={this.props.getTemplates}/>
        </InnerCardsContainer>
      </OuterCardsContainer>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TemplatesPage));
