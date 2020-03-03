import React from "react";
import { connect } from "react-redux";

import { RootState } from "../../store/rootReducer";
import { UserType } from "../../store/auth/types";
import { AllTemplateState } from "../../store/templates/types";
import { RecentTemplatesState } from "../../store/recentTemplates/types";
import { setPage } from "../../store/page/actions";
import { getAllTemplates } from "../../store/templates/actions";
import { getTemplate } from "../../store/currentTemplate/actions";
import { getRecentTemplates } from "../../store/recentTemplates/actions";

import requireAuthentication from "../../utils/requireAuthentication";
import Gallery from "../Gallery";
import PreviewModal from "./PreviewModal";
import SearchPage from "./SearchPage/SearchPage";
import { setSearchBarVisible } from "../../store/search/actions";

import { Title, DashboardContainer, OuterWindow, TagsContainer, RecentlyViewedContainer, RecentlyViewedHeader } from "./styled";
import { VersionCardRow, VersionCardRowTitle, VersionCardRowText, CardTitle } from "./PreviewModal/TemplateInfo/VersionCard/styled";
import { Card, CardBody, CardHeader, RowWrapper } from "./PreviewModal/TemplateInfo/styled";
import { Template, UserList, User } from "adaptive-templating-service-typescript-node";
import Tags from "../Common/Tags";
const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    templates: state.allTemplates,
    isSearch: state.search.isSearch,
    recentTemplates: state.recentTemplates
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

interface State {
  isPreviewOpen: boolean;
}

interface Props {
  isAuthenticated: boolean;
  user?: UserType;
  recentTemplates: RecentTemplatesState;
  templates: AllTemplateState;
  authButtonMethod: () => Promise<void>;
  setPage: (currentPageTitle: string, currentPage: string) => void;
  setSearchBarVisible: (isSearchBarVisible: boolean) => void;
  getTemplates: () => void;
  getRecentTemplates: () => void;
  // getRecentlyViewedTemplates(): () => void;
  // getRecentlyEditedTemplates(): () => void;
  getTemplate: (templateID: string) => void;
  isSearch: boolean;
}

class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isPreviewOpen: false };
    props.setPage("Dashboard", "Dashboard");
    props.setSearchBarVisible(true);
    props.getTemplates();
    props.getRecentTemplates();
  }

  selectTemplate = (templateID: string) => {
    this.props.getTemplate(templateID);
    this.toggleModal();
  };

  toggleModal = () => {
    this.setState({ isPreviewOpen: !this.state.isPreviewOpen });
  };
  render() {
    if (this.props.isSearch) {
      return (
        <DashboardContainer>
          <SearchPage />
        </DashboardContainer>
      );
    }

    //TODO add sort functionality to separate templates displayed in recent vs draft
    let templates = new Array<Template>();
    let user: User;

    if (!this.props.templates.isFetching && this.props.templates.templates && this.props.templates.templates.templates) {
      templates = this.props.templates.templates.templates;
    }
    if (!this.props.recentTemplates.isFetching && this.props.recentTemplates.recentlyEdited && this.props.recentTemplates.recentlyViewed) {
      console.log(this.props.recentTemplates);
      // console.log(this.props.recentTemplates);
    }
    const tags: string[] = ["tag1", "myTagNumberTwo", "myTagNumberThreeeeee"];
    this.props.setPage("Dashboard", "Dashboard");
    return (
      <OuterWindow>
        <DashboardContainer>
          <Title>Recently Edited</Title>
          <Gallery onClick={this.selectTemplate} templates={templates}></Gallery>
          <PreviewModal show={this.state.isPreviewOpen} toggleModal={this.toggleModal} />
          <Title>Recently Viewed</Title>
          <RecentlyViewedContainer>
            <RecentlyViewedHeader>
              <CardTitle>Name</CardTitle>
              <CardTitle>Date Modified</CardTitle>
              <CardTitle>Status</CardTitle>
              <CardTitle>Owner</CardTitle>
            </RecentlyViewedHeader>
            <CardBody></CardBody>
          </RecentlyViewedContainer>
        </DashboardContainer>
        <TagsContainer>
          <Title style={{ marginRight: "150px" }}>Tags</Title>
          <Tags tags={tags} allowEdit={false}></Tags>
        </TagsContainer>
      </OuterWindow>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireAuthentication(Dashboard));
