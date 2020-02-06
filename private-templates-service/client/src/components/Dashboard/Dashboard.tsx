import React from "react";

import { RootState } from "../../store/rootReducer";
import { UserType } from "../../store/auth/types";
import { connect } from "react-redux";
import requireAuthentication from "../../utils/requireAuthentication";
import Gallery from "../Gallery";
import { Title, DashboardContainer } from "../Dashboard/styled";
import { setPage } from "../../store/page/actions";

const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
  };
};

interface DashboardProps {
  isAuthenticated: boolean;
  user?: UserType;
  authButtonMethod: () => Promise<void>;
  setPage: (currentPageTitle: string) => void;
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    setPage: (currentPageTitle: string) => {
      dispatch(setPage(currentPageTitle));
    }
  }
}

class Dashboard extends React.Component<DashboardProps, {}> {

  constructor(props: DashboardProps){
    super(props);
    props.setPage("Dashboard");
  }

  render() {
    return (
      <DashboardContainer>
        <Title>Recent</Title>
        <Gallery></Gallery>
        <Title>Drafts</Title>
        <Gallery></Gallery>
      </DashboardContainer>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireAuthentication(Dashboard));
