import React, { Component } from "react";
import { RootState } from "../../store/rootReducer";
import { getAllTemplates } from "../../store/templates/actions";
import { AllTemplateState } from "../../store/templates/types";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import requireAuthentication from "../../utils/requireAuthentication";
import Gallery from "../Gallery";
import { Template } from "adaptive-templating-service-typescript-node";
import { setPage } from "../../store/page/actions";
import { setSearchBarVisible } from "../../store/search/actions";
import { AllCardsContainer, OuterAllCardsContainer, UpperBar, TagsContainer, ViewHelperBar, ViewToggleBar} from "./styled";
import { Title, CenteredSpinner, PlaceholderText } from "../Dashboard/styled";
import Sort from "../Dashboard/SearchPage/Sort";
import Filter from "../Dashboard/SearchPage/Filter";
import SearchPage from "../Dashboard/SearchPage";
import { ALLCARDS_PLACEHOLDER, ALLCARDS_LIST_VIEW, ALLCARDS_GRID_VIEW } from "../../assets/strings";
import { SpinnerSize, IconButton, IIconProps, IContextualMenuProps } from "office-ui-fabric-react";
import Tags from "../Common/Tags";
import { Scroller } from "../../utils/AllCardsUtil";


const mapStateToProps = (state: RootState) => {
  return {
    templates: state.allTemplates,
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
    getTemplates: () => {
      dispatch(getAllTemplates());
    }
  }
};
interface Props extends RouteComponentProps {
  templates: AllTemplateState;
  getTemplates: () => void;
  setPage: (currentPageTitle: string, currentPage: string) => void;
  setSearchBarVisible: (isSearchBarVisible: boolean) => void;
  isSearch: boolean;
}

class AllCards extends Component<Props> {
  scroller: Scroller;
  constructor(props: Props) {
    super(props);
    this.scroller = new Scroller();
    this.props.setPage("Cards", "AllCards");
    this.props.setSearchBarVisible(true);
    this.props.getTemplates();  
  }
  componentDidUpdate(prevProps: Props) {
    if (this.props.isSearch !== prevProps.isSearch) {
      if (this.props.isSearch) {
        this.props.setPage("All Cards", "searchPage");
      } else {
        this.props.setPage("Cards", "AllCards");
      }
    }
  }

  selectTemplate = (templateID: string) => {
    this.props.history.push("preview/" + templateID);
  };


  onLoad = (isFetching: boolean, templates: Template[], placeHolder: string) => {
    return isFetching ?
      <CenteredSpinner size={SpinnerSize.large} />
      : templates.length ? (
        <Gallery
          onClick={this.selectTemplate}
          templates={templates}
        />
      ) : (
          <PlaceholderText>
            {placeHolder}
          </PlaceholderText>
        )
  }
  // TODO: decide which method to use
  render() {
    if (this.props.isSearch) {
      return (
        <AllCardsContainer>
          <SearchPage selectTemplate={this.selectTemplate} />
        </AllCardsContainer>
      );
    }


    let templatesState: AllTemplateState = this.props.templates;
    let templates: Template[] = Array();
    let tags: string[] = ["hello", "john", "weather","hello", "john", "hello", "john", "weather","hello", "john","hello", "john", "weather","hello", "john", "weather","hello", "john", "weather", "tags", "john 1", "hello", "john", "weather", "tags", "john 1"];

    if (
      !templatesState.isFetching &&
      templatesState.templates &&
      templatesState.templates.templates
    ) {
     templates = templatesState.templates.templates;
    }

    return(
    <OuterAllCardsContainer>
      <AllCardsContainer>
        <UpperBar>
          <Title>
            All Cards
          </Title>
          <ViewHelperBar>
            <IconButton iconProps={{iconName: "BulletedList"}} title={ALLCARDS_LIST_VIEW} />
            <IconButton iconProps={{iconName: "GridViewMedium"}} title={ALLCARDS_GRID_VIEW} />
            <Sort />
            <Filter />
          </ViewHelperBar>
        </UpperBar>
        <TagsContainer onWheel={this.scroller.horizontalScroll}>
        <Tags tags={tags} allowEdit={false}></Tags>
        </TagsContainer>
        {this.onLoad(templatesState.isFetching, templates, ALLCARDS_PLACEHOLDER)}
    </AllCardsContainer>
     </OuterAllCardsContainer>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(requireAuthentication(withRouter(AllCards)));
