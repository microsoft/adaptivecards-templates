import React, { ReactElement } from "react";

import { UserType } from "../../store/auth/types";
import { RootState } from "../../store/rootReducer";

import { Button, Jumbotron } from "reactstrap";
import { connect } from "react-redux";

interface WelcomeProps {
  isAuthenticated: boolean;
  user: UserType | {};
  authButtonMethod: () => Promise<void>;
}

const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: state.isAuthenticated,
    user: state.user
  };
};

const WelcomeContent = (props: WelcomeProps): ReactElement => {
  // If authenticated, greet the user
  if (props.isAuthenticated && "displayName" in props.user) {
    if ("organization" in props.user) {
      return (
        <div>
          <h4>
            Welcome {props.user.displayName} from{" "}
            {props.user.organization}!
					</h4>
        </div>
      );
    }
    return (
      <div>
        <h4>Welcome {props.user.displayName}!</h4>
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
};

class Welcome extends React.Component<WelcomeProps> {
  render() {
    return (
      <Jumbotron>
        <h1>Admin Portal</h1>
        <p className="lead">Basic authentication test.</p>
        <WelcomeContent
          isAuthenticated={this.props.isAuthenticated}
          user={this.props.user}
          authButtonMethod={this.props.authButtonMethod}
        />
      </Jumbotron>
    );
  }
}

const VisibleWelcome = connect(mapStateToProps)(Welcome);

export default VisibleWelcome;
