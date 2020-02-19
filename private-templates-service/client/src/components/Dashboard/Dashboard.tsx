import React from "react";

import { RootState } from "../../store/rootReducer";
import { connect } from "react-redux";
import { setPage } from "../../store/page/actions";

import requireAuthentication from "../../utils/requireAuthentication";
import Gallery from "../Gallery";
import { Title, DashboardContainer } from "../Dashboard/styled";
import PreviewModal from "./PreviewModal";
import SearchPage from './SearchPage/SearchPage';

const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    isSearch: state.search.isSearch
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setPage: (currentPageTitle: string) => {
      dispatch(setPage(currentPageTitle));
    }
  };
};

interface State {
  isPreviewOpen: boolean;
}

interface Props {
  isAuthenticated: boolean;
  authButtonMethod: () => Promise<void>;
  setPage: (currentPageTitle: string) => void;
  isSearch: boolean;
}

class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isPreviewOpen: false };
    props.setPage("Dashboard");
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
    return (
      <DashboardContainer>
        <Title>Recent</Title>
        <Gallery toggleModal={this.toggleModal}></Gallery>
        <PreviewModal show={this.state.isPreviewOpen} toggleModal={this.toggleModal}/>
        <Title>Drafts</Title>
        <Gallery toggleModal={this.toggleModal}></Gallery>
        <PreviewModal show={this.state.isPreviewOpen} toggleModal={this.toggleModal}/>
      </DashboardContainer>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireAuthentication(Dashboard));
