import React from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { RootState } from "../../store/rootReducer";
import { UserType } from "../../store/auth/types";
import { AllTemplateState } from '../../store/templates/types';
import { setPage } from "../../store/page/actions";
import { getAllTemplates } from "../../store/templates/actions";
import { setSearchBarVisible } from "../../store/search/actions";

import requireAuthentication from "../../utils/requireAuthentication";
import Gallery from "../Gallery";
import SearchPage from './SearchPage/SearchPage';

import { Title, DashboardContainer } from "../Dashboard/styled";

import { Template } from 'adaptive-templating-service-typescript-node';

const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
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
}

interface Props extends RouteComponentProps {
  isAuthenticated: boolean;
  user?: UserType;
  templates: AllTemplateState;
  setPage: (currentPageTitle: string, currentPage: string) => void;
  setSearchBarVisible: (isSearchBarVisible: boolean) => void;
  getTemplates: () => void;
  isSearch: boolean;
}

class Dashboard extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.setPage("Dashboard", "Dashboard");
    props.setSearchBarVisible(true);
    props.getTemplates();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.isSearch !== prevProps.isSearch) {
      if (this.props.isSearch) {
        this.props.setPage("Templates", "searchPage");
      } else {
        this.props.setPage('Dashboard', 'Dashboard');
      }
    }
  }

  selectTemplate = (templateID: string) => {
    this.props.history.push('template/' + templateID);
  }

  render() {
    if (this.props.isSearch) {
      return (
        <DashboardContainer>
          <SearchPage selectTemplate={this.selectTemplate} />
        </DashboardContainer>
      );
    }
    //TODO add sort functionality to separate templates displayed in recent vs draft
    let templates = new Array<Template>();
    if (!this.props.templates.isFetching && this.props.templates.templates && this.props.templates.templates.templates) {
      templates = this.props.templates.templates.templates;
    }

    return (
      <DashboardContainer>
        <Title>Recent</Title>
        <Gallery onClick={this.selectTemplate} templates={templates}></Gallery>
      </DashboardContainer>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireAuthentication(withRouter(Dashboard)));
