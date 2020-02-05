import React from "react";

import { RootState } from "../../store/rootReducer";
import { UserType } from "../../store/auth/types";
import { connect } from "react-redux";
import { ErrorMessageProps } from "../ErrorMessage/ErrorMessage";
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

interface DashboardStates {
  error: ErrorMessageProps | null;
  isPreviewOpen: boolean;
}

interface DashboardProps {
  isAuthenticated: boolean;
  user?: UserType;
  authButtonMethod: () => Promise<void>;
}

class Dashboard extends React.Component<DashboardProps, DashboardStates> {
  constructor(props: DashboardProps) {
    super(props);
    this.state = { error: null, isPreviewOpen: false };
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

export default connect(mapStateToProps)(requireAuthentication(Dashboard));
