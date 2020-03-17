import React from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { RootState } from "../../store/rootReducer";
import { UserType } from "../../store/auth/types";
import { AllTemplateState } from "../../store/templates/types";
import { RecentTemplatesState } from "../../store/recentTemplates/types";
import { setPage } from "../../store/page/actions";
import { getAllTemplates } from "../../store/templates/actions";
import { getTemplate } from "../../store/currentTemplate/actions";
import { getRecentTemplates } from "../../store/recentTemplates/actions";
import { setSearchBarVisible } from "../../store/search/actions";
import requireAuthentication from "../../utils/requireAuthentication";
import Gallery from "../Gallery";
import SearchPage from "./SearchPage/SearchPage";
import { Template } from "adaptive-templating-service-typescript-node";
import { RecentlyViewed } from "./RecentlyViewed/RecentlyViewed";
import Tags from "../Common/Tags";
import {
  Title,
  DashboardContainer,
  OuterWindow,
  TagsContainer,
  PlaceholderText,
  CenteredSpinner,
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
    this.props.history.push("template/" + templateID);
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
      <OuterWindow>
        <DashboardContainer>
          <React.Fragment>
            <Title>Recently Edited</Title>
            {recentTemplates.isFetching ?
              <CenteredSpinner />
              : recentlyEditedTemplates.length ? (
                <Gallery
                  onClick={this.selectTemplate}
                  templates={recentlyEditedTemplates}
                ></Gallery>
              ) : (
                  <PlaceholderText>
                    No edited templates yet. Create or edit one :)
              </PlaceholderText>
                )}
          </React.Fragment>
          <React.Fragment>
            <Title>Recently Viewed</Title>
            {recentTemplates.isFetching ?
              <CenteredSpinner />
              : recentlyViewedTemplates.length ? (
                <RecentlyViewed
                  onClick={this.selectTemplate}
                  recentlyViewed={recentlyViewedTemplates}
                ></RecentlyViewed>
              ) : (
                  <PlaceholderText>
                    No recently viewed templates yet. Check out some templates:)
              </PlaceholderText>
                )}
          </React.Fragment>
        </DashboardContainer>
        <TagsContainer>
          <Title style={{ marginRight: "150px" }}>Tags</Title>
          <Tags tags={tags} allowEdit={false}></Tags>
        </TagsContainer>
      </OuterWindow>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(requireAuthentication(withRouter(Dashboard)));
