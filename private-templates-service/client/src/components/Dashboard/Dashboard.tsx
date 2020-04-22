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
import { getOwnerProfilePicture, getOwnerName } from "../../store/templateOwner/actions";
import { OwnerState } from "../../store/templateOwner/types";
import { setSkipLinkContentID } from "../../store/skiplink/actions";
import { getAllTags, addSelectedTag, clearSelectedTags, removeFavoriteTags, addFavoriteTags } from "../../store/tags/actions";
import { TagsState } from "../../store/tags/types";

import { Template } from "adaptive-templating-service-typescript-node";
import { SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

import requireAuthentication from "../../utils/requireAuthentication";

import RecentlyEditedPlaceholder from './RecentlyEditedPlaceholder';
import Gallery from "../Gallery";
import { allTemplatesURL } from "../SideBar/SideBar";
import TemplateList from "./TemplateList";
import Footer from "./Footer";
import TagList from "../Common/TemplatesPage/TagList";
import {
  FAVORITED_TAGS,
  RECENTLY_EDITED,
  RECENTLY_VIEWED,
  DASHBOARD_PAGE,
  TEMPLATE_PAGE
} from '../../assets/strings';

import {
  Title,
  DashboardContainer,
  RecentlyEditedSection,
  OuterWindow,
  TagsContainer,
  CenteredSpinner,
  OuterDashboardContainer,
} from "./styled";


const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    templates: state.allTemplates,
    recentTemplates: state.recentTemplates,
    templateOwner: state.templateOwner,
    tags: state.tags
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    setPage: (currentPageTitle: string, currentPage: string) => {
      dispatch(setPage(currentPageTitle, currentPage));
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
    },
    getTags: () => {
      dispatch(getAllTags());
    },
    addSelectedTag: (tag: string) => {
      dispatch(addSelectedTag(tag))
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
interface Props extends RouteComponentProps {
  isAuthenticated: boolean;
  user?: UserType;
  recentTemplates: RecentTemplatesState;
  templates: AllTemplateState;
  templateOwner: OwnerState;
  tags: TagsState;
  setPage: (currentPageTitle: string, currentPage: string) => void;
  getTemplates: () => void;
  getRecentTemplates: () => void;
  getTemplate: (templateID: string) => void;
  getOwnerName: (oID: string) => void;
  getOwnerProfilePicture: (oID: string) => void;
  setSkipLinkContentID: (id: string) => void;
  getTags: () => void;
  addSelectedTag: (tag: string) => void;
  clearSelectedTags: () => void;
  onAddFavoriteTag: (tag: string) => void;
  onRemoveFavoriteTag: (tag: string) => void;
  isSearch: boolean;
}

class Dashboard extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.setPage(DASHBOARD_PAGE, DASHBOARD_PAGE);
    props.getRecentTemplates();
    props.setSkipLinkContentID(DASHBOARD_MAIN_CONTENT_ID);
  }

  componentDidMount() {
    this.props.getTags();
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
      let alreadySent = new Set();
      for (let template of templates) {
        if (template.instances && template.instances[0].lastEditedUser && (!(alreadySent.has(template.instances[0].lastEditedUser)))) {
          alreadySent.add(template.instances[0].lastEditedUser);
          this.props.getOwnerName(template.instances[0].lastEditedUser);
          this.props.getOwnerProfilePicture(template.instances[0].lastEditedUser);
        }
      }
    }
  }
  selectTemplate = (templateID: string) => {
    this.props.history.push("/preview/" + templateID);
  };

  tagOnClick = (tag: string) => {
    this.props.clearSelectedTags();
    this.props.addSelectedTag(tag);
    this.props.history.push(allTemplatesURL, {redirect: true});
  }
  render() {
    //TODO add sort functionality to separate templates displayed in recent vs draft
    const { recentTemplates, tags } = this.props;
    let recentlyEditedTemplates = new Array<Template>();
    let recentlyViewedTemplates = new Array<Template>();
    let favoriteTags: string[] = [];

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
    // let tags: string[] = ["hey", "one", "john"];
    if (!tags.isFetching && tags.allTags && tags.allTags.favoriteTags) {
      favoriteTags = tags.allTags.favoriteTags;
    }
    return (
      <OuterDashboardContainer>
        <OuterWindow>
          <DashboardContainer id={DASHBOARD_MAIN_CONTENT_ID}>
            <RecentlyEditedSection aria-label={RECENTLY_EDITED} isPlaceholder={recentlyEditedTemplates.length === 0}>
              <Title>{RECENTLY_EDITED}</Title>
              {recentTemplates.isFetching || this.props.templateOwner.isFetchingName || this.props.templateOwner.isFetchingPicture ?
                <CenteredSpinner size={SpinnerSize.large} />
                : recentlyEditedTemplates.length ? (
                  <Gallery
                    onClick={this.selectTemplate}
                    templates={recentlyEditedTemplates}
                  ></Gallery>
                ) : (
                    <RecentlyEditedPlaceholder />
                  )}
            </RecentlyEditedSection>
            <section aria-label={RECENTLY_VIEWED}>
              <Title>{RECENTLY_VIEWED}</Title>
              {recentTemplates.isFetching || this.props.templateOwner.isFetchingName || this.props.templateOwner.isFetchingPicture ?
                <CenteredSpinner size={SpinnerSize.large} />
                : (
                  <TemplateList
                    onClick={this.selectTemplate}
                    templates={recentlyViewedTemplates}
                    displayComponents={{ author: true, status: true, dateModified: true, templateName: true, version: false }}

                  />
                )}
            </section>
          </DashboardContainer>
          <TagsContainer aria-label={FAVORITED_TAGS}>
            <Title>{FAVORITED_TAGS}</Title>
            <TagList tags={favoriteTags}
              allowEdit={false}
              onClick={this.tagOnClick}
              allowSetFavorite={true}
              onAddFavoriteTag={this.props.onAddFavoriteTag}
              onRemoveFavoriteTag={this.props.onRemoveFavoriteTag}
              favoriteTags={favoriteTags} />
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
