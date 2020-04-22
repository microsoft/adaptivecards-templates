import React, { ReactElement } from "react";

import { UserType } from "../../store/auth/types";
import { RootState } from "../../store/rootReducer";

import { Button } from "reactstrap";
import { connect } from "react-redux";
import { OuterWrapper } from "./styled";
import { COLORS } from "../../globalStyles";
import { CLICK_HERE, ADMIN_PORTAL, BASIC_AUTH } from "../../assets/strings";

const mapStateToPropsWelcome = (state: RootState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
  };
};

interface WelcomeProps {
  user?: UserType;
  authButtonMethod: () => Promise<void>;
}

const WelcomeContent = (props: WelcomeProps): ReactElement => {
  // Not authenticated, present a sign in button
  return (
    <React.Fragment>
      <Button style={{ backgroundColor: COLORS.BLUE }} onClick={props.authButtonMethod}>
        {CLICK_HERE}
      </Button>
    </React.Fragment>
  );
}

class Welcome extends React.Component<WelcomeProps> {
  render() {
    return (
      <OuterWrapper>
        <h1>{ADMIN_PORTAL}</h1>
        <p className="lead">{BASIC_AUTH}</p>
        <WelcomeContent
          user={this.props.user}
          authButtonMethod={this.props.authButtonMethod}
        />
      </OuterWrapper>
    );
  }
}

export default connect(mapStateToPropsWelcome)(Welcome);
