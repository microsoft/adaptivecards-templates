import React, { ReactElement } from "react";

import { UserType } from "../../store/auth/types";
import { RootState } from "../../store/rootReducer";

import { Button, Jumbotron } from "reactstrap";
import { connect } from "react-redux";

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
      <Button color="primary" onClick={props.authButtonMethod}>
        Click here to sign in
      </Button>
    </React.Fragment>
  );
}

class Welcome extends React.Component<WelcomeProps> {
  render() {
    return (
      <Jumbotron>
        <h1>Admin Portal</h1>
        <p className="lead">Basic authentication test.</p>
        <WelcomeContent
          user={this.props.user}
          authButtonMethod={this.props.authButtonMethod}
        />
      </Jumbotron>
    );
  }
}

export default connect(mapStateToPropsWelcome)(Welcome);
