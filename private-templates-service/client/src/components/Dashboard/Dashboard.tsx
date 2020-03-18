import React from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { RootState } from "../../store/rootReducer";
import { UserType } from "../../store/auth/types";
import { getAllTemplates } from "../../store/templates/actions";
import { AllTemplateState } from "../../store/templates/types";
import { getRecentTemplates } from "../../store/recentTemplates/actions";
import { RecentTemplatesState } from "../../store/recentTemplates/types";
import { setPage } from "../../store/page/actions";
import { getTemplate } from "../../store/currentTemplate/actions";
import { setSearchBarVisible } from "../../store/search/actions";

import { Template } from "adaptive-templating-service-typescript-node";
import { SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

import requireAuthentication from "../../utils/requireAuthentication";

import Gallery from "../Gallery";
import SearchPage from "./SearchPage/SearchPage";
import RecentlyViewed from "./RecentlyViewed";
import Tags from "../Common/Tags";
import Footer from "./Footer";
import {
  DASHBOARD_RECENTLY_EDITED_PLACEHOLDER,
  DASHBOARD_RECENTLY_VIEWED_PLACEHOLDER,
} from '../../assets/strings';


import {
  Title,
  DashboardContainer,
  OuterWindow,
  TagsContainer,
  PlaceholderText,
  CenteredSpinner,
  OuterDashboardContainer
} from "./styled";

const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    templates: state.allTemplates,
    isSearch: state.search.isSearch,
    recentTemplates: state.recentTemplates,
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
    },
    getTemplate: (templateID: string) => {
      dispatch(getTemplate(templateID));
    },
    getRecentTemplates: () => {
      dispatch(getRecentTemplates());
    }
  };
};
interface Props extends RouteComponentProps {
  isAuthenticated: boolean;
  user?: UserType;
  recentTemplates: RecentTemplatesState;
  templates: AllTemplateState;
  setPage: (currentPageTitle: string, currentPage: string) => void;
  setSearchBarVisible: (isSearchBarVisible: boolean) => void;
  getTemplates: () => void;
  getRecentTemplates: () => void;
  getTemplate: (templateID: string) => void;
  isSearch: boolean;
}
class Dashboard extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.setPage("Dashboard", "Dashboard");
    props.setSearchBarVisible(true);
    props.getRecentTemplates();
  }
  componentDidUpdate(prevProps: Props) {
    if (this.props.isSearch !== prevProps.isSearch) {
      if (this.props.isSearch) {
        this.props.setPage("Templates", "searchPage");
      } else {
        this.props.setPage("Dashboard", "Dashboard");
      }
    }
  }
  selectTemplate = (templateID: string) => {
    this.props.history.push("preview/" + templateID);
  };
  render() {
    if (this.props.isSearch) {
      return (
        <DashboardContainer>
          <SearchPage selectTemplate={this.selectTemplate} />
        </DashboardContainer>
      );
    }
    //TODO add sort functionality to separate templates displayed in recent vs draft
    let recentTemplates = this.props.recentTemplates;
    let recentlyEditedTemplates = new Array<Template>();
    let recentlyViewedTemplates = new Array<Template>();

    if (
      !recentTemplates.isFetching &&
      recentTemplates.recentlyEdited &&
      recentTemplates.recentlyEdited.templates
    ) {
      recentlyEditedTemplates = recentTemplates.recentlyEdited.templates;
    }
    if (
      !recentTemplates.isFetching &&
      recentTemplates.recentlyViewed &&
      recentTemplates.recentlyViewed.templates
    ) {
      recentlyViewedTemplates = recentTemplates.recentlyViewed.templates;
    }
    // TODO: Get tags and make them clickable
    let tags: string[] = new Array();
    return (
      <OuterDashboardContainer>
        <OuterWindow>
          <DashboardContainer>
            <React.Fragment>
              <Title>Recently Edited</Title>
              {recentTemplates.isFetching ?
                <CenteredSpinner size={SpinnerSize.large} />
                : recentlyEditedTemplates.length ? (
                  <Gallery
                    onClick={this.selectTemplate}
                    templates={recentlyEditedTemplates}
                  ></Gallery>
                ) : (
                    <PlaceholderText>
                      {DASHBOARD_RECENTLY_EDITED_PLACEHOLDER}
                    </PlaceholderText>
                  )}
            </React.Fragment>
            <React.Fragment>
              <Title>Recently Viewed</Title>
              {recentTemplates.isFetching ?
                <CenteredSpinner size={SpinnerSize.large} />
                : recentlyViewedTemplates.length ? (
                  <RecentlyViewed
                    onClick={this.selectTemplate}
                    recentlyViewed={recentlyViewedTemplates}
                  ></RecentlyViewed>
                ) : (
                  <PlaceholderText>
                    {DASHBOARD_RECENTLY_VIEWED_PLACEHOLDER}
                  </PlaceholderText>
                )}
            </React.Fragment>
          </DashboardContainer>
          <TagsContainer>
            <Title style={{ marginRight: "150px", color: 'pink' }}>Tags</Title>
            <Tags tags={tags} allowEdit={false}></Tags>
          </TagsContainer>
        </OuterWindow>
        <Footer />
      </OuterDashboardContainer>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(requireAuthentication(withRouter(Dashboard)));
