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
import { AllCardsContainer, OuterAllCardsContainer, UpperBar } from "./styled";
import { Title } from "../Dashboard/styled";
import { SearchAndFilter } from "../Dashboard/SearchPage/styled";
import Sort from "../Dashboard/SearchPage/Sort";
import Filter from "../Dashboard/SearchPage/Filter";
import SearchPage from "../Dashboard/SearchPage";


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
  constructor(props: Props) {
    super(props);
    this.props.setPage("Cards", "AllCards");
    this.props.setSearchBarVisible(true);
    this.props.getTemplates();  
  }
  componentDidUpdate(prevProps: Props) {
    if (this.props.isSearch !== prevProps.isSearch) {
      if (this.props.isSearch) {
        this.props.setPage("All Cards", "searchPage");
      } else {
        this.props.setPage("All Cards", "All Cards");
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

    
    let templatesState: AllTemplateState = this.props.templates;
    let templates: Template[] = Array();

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
          <SearchAndFilter>
            <Sort />
            <Filter />
          </SearchAndFilter>
        </UpperBar>
       <Gallery
                    onClick={this.selectTemplate}
                    templates={templates}
                  />
    </AllCardsContainer>
    </OuterAllCardsContainer>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(requireAuthentication(withRouter(AllCards)));
