import React from "react";
import { connect } from "react-redux";

import { RootState } from "../../store/rootReducer";
import { BatchTemplatesState } from '../../store/templates/types';
import { setPage } from "../../store/page/actions";
import { getAllTemplates } from "../../store/templates/actions";

import requireAuthentication from "../../utils/requireAuthentication";
import Gallery from "../Gallery";
import PreviewModal from "./PreviewModal";
import SearchPage from './SearchPage/SearchPage';

import { Title, DashboardContainer } from "../Dashboard/styled";

const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    batchTemplates: state.batchTemplates,
    isSearch: state.search.isSearch
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setPage: (currentPageTitle: string) => {
      dispatch(setPage(currentPageTitle));
    },
    getTemplates: () => { dispatch(getAllTemplates()) }
  }
}

interface State {
  isPreviewOpen: boolean;
}

interface Props {
  isAuthenticated: boolean;
  isSearch: boolean;
  batchTemplates: BatchTemplatesState;
  authButtonMethod: () => Promise<void>;
  setPage: (currentPageTitle: string) => void;
  getTemplates: () => void;
}

class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isPreviewOpen: false };
    props.setPage("Dashboard");
    props.getTemplates();
  }

  toggleModal = () => {
    this.setState({ isPreviewOpen: !this.state.isPreviewOpen });
  };

  render() {
    if(this.props.isSearch) {
      return(
        <DashboardContainer>
          <SearchPage/>
        </DashboardContainer>
      );
    }
    //TODO add sort functionality to separate templates displayed in recent vs draft
    let templates = undefined;
    if (!this.props.batchTemplates.isFetching && this.props.batchTemplates.templateList) {
      templates = this.props.batchTemplates.templateList.templates;
    }
    this.props.setPage("Dashboard");
    console.log(this.props.batchTemplates);
    return (
      <DashboardContainer>
        <Title>Recent</Title>
        <Gallery onClick={this.toggleModal} templates={templates}></Gallery>
        <PreviewModal show={this.state.isPreviewOpen} toggleModal={this.toggleModal} />
      </DashboardContainer>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireAuthentication(Dashboard));
