import React from "react";
import { connect } from "react-redux";

import { RootState } from "../../store/rootReducer";
import { UserType } from "../../store/auth/types";
import { AllTemplateState } from '../../store/templates/types';
import { setPage } from "../../store/page/actions";
import { getAllTemplates } from "../../store/templates/actions";
import { getTemplate } from "../../store/currentTemplate/actions";

import requireAuthentication from "../../utils/requireAuthentication";
import Gallery from "../Gallery";
import PreviewModal from "./PreviewModal";
import SearchPage from './SearchPage/SearchPage';

import { Title, DashboardContainer } from "../Dashboard/styled";

const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    batchTemplates: state.templates,
    isSearch: state.search.isSearch
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setPage: (currentPageTitle: string) => {
      dispatch(setPage(currentPageTitle));
    },
    getTemplates: () => { dispatch(getAllTemplates()) },
    getTemplate: (templateID: string) => {
      dispatch(getTemplate(templateID));
    }
  }
}

interface State {
  isPreviewOpen: boolean;
}

interface Props {
  isAuthenticated: boolean;
  user?: UserType;
  batchTemplates: AllTemplateState;
  authButtonMethod: () => Promise<void>;
  setPage: (currentPageTitle: string) => void;
  getTemplates: () => void;
  getTemplate: (templateID: string) => void;
  isSearch: boolean;
}

class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isPreviewOpen: false };
    props.setPage("Dashboard");
    props.getTemplates();
  }

  selectTemplate = (templateID: string) => {
    this.props.getTemplate(templateID);
    this.toggleModal();
  }

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
    let templates = undefined;
    if (!this.props.batchTemplates.isFetching && this.props.batchTemplates.templates) {
      templates = this.props.batchTemplates.templates.templates;
    }

    return (
      <DashboardContainer>
        <Title>Recent</Title>
        <Gallery onClick={this.selectTemplate} templates={templates}></Gallery>
        <PreviewModal show={this.state.isPreviewOpen} toggleModal={this.toggleModal} />
      </DashboardContainer>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireAuthentication(Dashboard));
