import React from "react";
import { Redirect } from "react-router-dom";
import { UserType } from "./App";
import Welcome from "./components/Welcome/Welcome";

interface State {
}
interface AuthProps {
  isAuthenticated: boolean,
  user?: UserType,
  authButtonMethod: () => Promise<void>
}

export function requireAuthentication(Component: any) {

  return class AuthenticatedComponent extends React.Component<AuthProps, State> {

    isAuthenticated() {
      return this.props.isAuthenticated;
    }

    render() {
      return (
        <div>
          {this.isAuthenticated() ?
            <Component {...this.props} /> :
            <Welcome {...this.props} />}
        </div>
      );
    }
  };
}

export default requireAuthentication;