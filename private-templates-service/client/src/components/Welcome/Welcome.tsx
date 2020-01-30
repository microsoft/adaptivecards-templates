import React, { ReactElement } from "react";

import { UserType } from "../../store/auth/types";
import { RootState } from "../../store/rootReducer";

import { Button, Jumbotron } from "reactstrap";
import { connect } from "react-redux";

interface WelcomeProps {
  user?: UserType;
  authButtonMethod: () => Promise<void>;
}

const mapStateToProps = (state: RootState) => {
  return {
    user: state.auth.user,
  };
}

const WelcomeContent = (props: WelcomeProps): ReactElement => {
  // If authenticated, greet the user
  if (props.user && props.user.displayName) {
    return (
      <div>
        <h4>
          Welcome {props.user.displayName}{props.user.organization && " from " + props.user.organization}!
        </h4>
      </div>
    );
  }

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

export default connect(mapStateToProps)(Welcome);
