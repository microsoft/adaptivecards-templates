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
import { getOwnerProfilePicture, getOwnerName } from "../../store/templateOwner/actions";
import { OwnerState } from "../../store/templateOwner/types";
import { setSkipLinkContentID } from "../../store/skiplink/actions";

import { Template } from "adaptive-templating-service-typescript-node";
import { SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

import requireAuthentication from "../../utils/requireAuthentication";

import Gallery from "../Gallery";
import SearchPage from "./SearchPage/SearchPage";
import TemplateList from "./TemplateList";
import Tags from "../Common/Tags";
import Footer from "./Footer";
import {
  DASHBOARD_RECENTLY_EDITED_PLACEHOLDER,
  DASHBOARD_RECENTLY_VIEWED_PLACEHOLDER,
  FAVORITED_TAGS,
  RECENTLY_EDITED,
  RECENTLY_VIEWED,
  DASHBOARD_PAGE,
  TEMPLATE_PAGE
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
    templateOwner: state.templateOwner,
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
    },
    getOwnerName: (oID: string) => {
      dispatch(getOwnerName(oID));
    },
    getOwnerProfilePicture: (oID: string) => {
      dispatch(getOwnerProfilePicture(oID));
    },
    setSkipLinkContentID: (id: string) => {
      dispatch(setSkipLinkContentID(id));
    }
  };
};
interface Props extends RouteComponentProps {
  isAuthenticated: boolean;
  user?: UserType;
  recentTemplates: RecentTemplatesState;
  templates: AllTemplateState;
  templateOwner: OwnerState;
  setPage: (currentPageTitle: string, currentPage: string) => void;
  setSearchBarVisible: (isSearchBarVisible: boolean) => void;
  getTemplates: () => void;
  getRecentTemplates: () => void;
  getTemplate: (templateID: string) => void;
  getOwnerName: (oID: string) => void;
  getOwnerProfilePicture: (oID: string) => void;
  setSkipLinkContentID: (id: string) => void;
  isSearch: boolean;
}
class Dashboard extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.setPage(DASHBOARD_PAGE, DASHBOARD_PAGE);
    props.setSearchBarVisible(true);
    props.getRecentTemplates();
    props.setSkipLinkContentID(DASHBOARD_MAIN_CONTENT_ID);
  }
  componentDidUpdate(prevProps: Props) {
    if (this.props.isSearch !== prevProps.isSearch) {
      if (this.props.isSearch) {
        this.props.setPage(TEMPLATE_PAGE, "searchPage");
      } else {
        this.props.setPage(DASHBOARD_PAGE, "Dashboard");
      }
    }
    if (prevProps.recentTemplates !== this.props.recentTemplates &&
      this.props.recentTemplates.recentlyViewed && this.props.recentTemplates.recentlyViewed.templates) {
      let templates = this.props.recentTemplates.recentlyViewed.templates;
      for (let template of templates) {
        if (template.instances && template.instances[0].lastEditedUser) {
          this.props.getOwnerName(template.instances[0].lastEditedUser);
          this.props.getOwnerProfilePicture(template.instances[0].lastEditedUser);
        }
      }
    }
  }
  selectTemplate = (templateID: string) => {
    this.props.history.push("/preview/" + templateID);
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
    let tags: string[] = [];
    return (
      <OuterDashboardContainer>
        <OuterWindow>
          <DashboardContainer id={DASHBOARD_MAIN_CONTENT_ID}>
            <section aria-label={RECENTLY_EDITED}>
              <Title>{RECENTLY_EDITED}</Title>
              {recentTemplates.isFetching || this.props.templateOwner.isFetchingName || this.props.templateOwner.isFetchingPicture ?
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
            </section>
            <section aria-label={RECENTLY_VIEWED}>
              <Title>{RECENTLY_VIEWED}</Title>
              {recentTemplates.isFetching || this.props.templateOwner.isFetchingName || this.props.templateOwner.isFetchingPicture ?
                <CenteredSpinner size={SpinnerSize.large} />
                : recentlyViewedTemplates.length ? (
                  <TemplateList
                    onClick={this.selectTemplate}
                    templates={recentlyViewedTemplates}
                    displayComponents={{ author: true, status: true, dateModified: true, templateName: true, version: false }}
                  />
                ) : (
                    <PlaceholderText>
                      {DASHBOARD_RECENTLY_VIEWED_PLACEHOLDER}
                    </PlaceholderText>
                  )}
            </section>
          </DashboardContainer>
          <TagsContainer aria-label={FAVORITED_TAGS}>
            <Title style={{ marginRight: "150px", color: 'pink' }}>{FAVORITED_TAGS}</Title>
            <Tags tags={tags} allowEdit={false}></Tags>
          </TagsContainer>
        </OuterWindow>
        <Footer />
      </OuterDashboardContainer>
    );
  }
}
export const DASHBOARD_MAIN_CONTENT_ID: string = "dashboard-content";

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(requireAuthentication(withRouter(Dashboard)));
