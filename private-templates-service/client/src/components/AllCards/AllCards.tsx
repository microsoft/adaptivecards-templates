// React
import React, { Component } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
// Store
import { RootState } from "../../store/rootReducer";
import { AllTemplateState } from "../../store/templates/types";
import { ViewType } from "../../store/viewToggle/types";
import { setViewToggleType } from "../../store/viewToggle/actions";
import { setPage } from "../../store/page/actions";
// Components
import { setSearchBarVisible } from "../../store/search/actions";
import { Title } from "../Dashboard/styled";
import { AllCardsContainer, OuterAllCardsContainer, UpperBar, ViewHelperBar } from "./styled";
import ToggleButton from "./ToggleButton";
import TemplatesView from "./TemplatesView";
import Sort from "../Dashboard/SearchPage/Sort";
import Filter from "../Dashboard/SearchPage/Filter";
import SearchPage from "../Dashboard/SearchPage";
// Utils
import requireAuthentication from "../../utils/requireAuthentication";
// Strings
import { ALL_CARDS_LIST_VIEW, ALL_CARDS_GRID_VIEW, ALL_CARDS, ALL_CARDS_TITLE } from "../../assets/strings";
import TagList from "./TagList";

const mapStateToProps = (state: RootState) => {
  return {
    isSearch: state.search.isSearch
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
    }
  };
};
interface Props extends RouteComponentProps {
  templates: AllTemplateState;
  setPage: (currentPageTitle: string, currentPage: string) => void;
  setSearchBarVisible: (isSearchBarVisible: boolean) => void;
  toggleView: (viewType: ViewType) => void;
  isSearch: boolean;
}

class AllCards extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.props.setPage(ALL_CARDS_TITLE, ALL_CARDS);
    this.props.setSearchBarVisible(true);
  }
  componentDidUpdate(prevProps: Props) {
    if (this.props.isSearch !== prevProps.isSearch) {
      if (this.props.isSearch) {
        this.props.setPage(ALL_CARDS_TITLE, "searchPage");
      } else {
        this.props.setPage(ALL_CARDS_TITLE, ALL_CARDS);
      }
    }
  }

  selectTemplate = (templateID: string) => {
    this.props.history.push("preview/" + templateID);
  };

  render() {
    if (this.props.isSearch) {
      return (
        <AllCardsContainer>
          <SearchPage selectTemplate={this.selectTemplate} />
        </AllCardsContainer>
      );
    }
    // Container for tags that will be fetched at run time. Not implemented yet.
    let tags: string[] = new Array();

    return (
      <OuterAllCardsContainer
        onWheel={e => {
          console.log("scrolling outer");
        }}
      >
        <AllCardsContainer
          onWheel={e => {
            console.log("scrolling inner");
          }}
        >
          <UpperBar>
            <Title>All Cards</Title>
            <ViewHelperBar>
              <ToggleButton iconProps={{ iconName: "BulletedList" }} onClick={this.props.toggleView} viewType={ViewType.List} title={ALL_CARDS_LIST_VIEW} />
              <ToggleButton iconProps={{ iconName: "GridViewMedium" }} onClick={this.props.toggleView} viewType={ViewType.Grid} title={ALL_CARDS_GRID_VIEW} />
              <Sort />
              <Filter />
            </ViewHelperBar>
          </UpperBar>
          <TagList tags={tags} allowEdit={false} />
          <TemplatesView onClick={this.selectTemplate} />
        </AllCardsContainer>
      </OuterAllCardsContainer>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireAuthentication(withRouter(AllCards)));
