import React, { ReactElement } from "react";
import { Button, Jumbotron } from "reactstrap";

import { UserType } from '../../App';

interface WelcomeProps {
  isAuthenticated: boolean;
  user?: UserType;
  authButtonMethod: () => Promise<void>;
}

const WelcomeContent = (props: WelcomeProps): ReactElement => {
  // If authenticated, greet the user
  if (props.isAuthenticated && props.user) {
    if (props.user.organization) {
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
}

export default class Welcome extends React.Component<WelcomeProps> {
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
