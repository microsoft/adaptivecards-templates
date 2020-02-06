import React from "react";

import { RootState } from "../../store/rootReducer";
import { UserType } from "../../store/auth/types";
import { connect } from "react-redux";
import { setPage } from "../../store/page/actions";

import requireAuthentication from "../../utils/requireAuthentication";
import Gallery from "../Gallery";
import { Title, DashboardContainer } from "../Dashboard/styled";
import PreviewModal from "./PreviewModal";

const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setPage: (currentPageTitle: string) => {
      dispatch(setPage(currentPageTitle));
    }
  }
}

interface State {
  isPreviewOpen: boolean;
}

interface Props {
  isAuthenticated: boolean;
  user?: UserType;
  authButtonMethod: () => Promise<void>;
  setPage: (currentPageTitle: string) => void;
}

class Dashboard extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = { isPreviewOpen: false };
    props.setPage("Dashboard");
  }

  toggleModal = () => {
    this.setState({ isPreviewOpen: !this.state.isPreviewOpen });
  }

  render() {
    return (
      <DashboardContainer>
        <Title>Recent</Title>
        <Gallery toggleModal={this.toggleModal}></Gallery>
        <Title>Drafts</Title>
        <Gallery toggleModal={this.toggleModal}></Gallery>
        <PreviewModal show={this.state.isPreviewOpen} toggleModal={this.toggleModal} />
      </DashboardContainer>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireAuthentication(Dashboard));
