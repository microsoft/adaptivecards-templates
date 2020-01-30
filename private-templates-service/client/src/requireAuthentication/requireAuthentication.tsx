import React from "react";
import { UserType } from "../App";
import Welcome from "../components/Welcome/Welcome";

interface AuthProps {
  isAuthenticated: boolean,
  user?: UserType,
  authButtonMethod: () => Promise<void>
}

const requireAuthentication = <P extends object>(Component: React.ComponentType<P>) => {
  return class AuthenticatedComponent extends React.Component<P & AuthProps> {

    isAuth = () => this.props.isAuthenticated;

    render() {
      return (
        <div>
          {this.isAuth() ?
            <Component {...this.props} /> :
            <Welcome {...this.props} />}
        </div>
      );
    }
  };
}

export default requireAuthentication;