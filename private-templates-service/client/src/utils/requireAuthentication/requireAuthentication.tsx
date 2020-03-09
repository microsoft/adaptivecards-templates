import React from "react";
import Welcome from "../../components/Welcome/Welcome";

import { UserType } from '../../store/auth/types';
import { RootState } from "../../store/rootReducer";
import { connect } from "react-redux";

interface AuthProps {
  isAuthenticated: boolean,
  user?: UserType,
  authButtonMethod: () => Promise<void>
}

const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
  };
};

const requireAuthentication = <P extends object>(Component: React.ComponentType<P>) => {
  return class AuthenticatedComponent extends React.Component<P & AuthProps> {

    isAuth = () => this.props.isAuthenticated;

    render() {
      return (
        <React.Fragment>
          {this.isAuth() ?
            <Component {...this.props} /> :
            <Welcome {...this.props} />}
        </React.Fragment>
      );
    }
  };
}

export default (c: any) => connect(mapStateToProps)(requireAuthentication(c));