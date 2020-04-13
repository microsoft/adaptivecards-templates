import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { UserAgentApplication, ClientAuthError } from "msal";
import { AuthResponse } from 'msal';
import { initializeIcons } from '@uifabric/icons';
import IdleTimer from 'react-idle-timer';

// Redux
import { connect } from "react-redux";
import { setAccessToken, setGraphAccessToken, getUserDetails, getOrgDetails, getProfilePicture, logout } from "./store/auth/actions";
import { UserType } from "./store/auth/types";
import { RootState } from "./store/rootReducer";

// Components
import Designer from "./components/Designer";
import NavBar from "./components/NavBar/NavBar";
import SideBar from "./components/SideBar";
import Dashboard from "./components/Dashboard";
import Shared from "./components/Shared/";
import PreviewModal from './components/Dashboard/PreviewModal';
import ErrorMessage, { ErrorMessageProps } from "./components/ErrorMessage/ErrorMessage";
import AllCards from "./components/AllCards";
import NoMatch from "./components/NoMatch";
import config from "./Config";

// CSS
import "bootstrap/dist/css/bootstrap.css";
import { OuterAppWrapper, MainAppWrapper, MainApp } from "./styled";

// Constants
import Constants from "./globalConstants"

interface State {
  error: ErrorMessageProps | null;
}

const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    searchByTemplateName: state.search.searchByTemplateName
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setAccessToken: (accessToken: AuthResponse) => {
      dispatch(setAccessToken(accessToken));
    },
    setGraphAccessToken: (accessToken: AuthResponse) => {
      dispatch(setGraphAccessToken(accessToken));
    },
    getUserDetails: () => {
      dispatch(getUserDetails());
    },
    getOrgDetails: () => {
      dispatch(getOrgDetails());
    },
    getProfilePicture: () => {
      dispatch(getProfilePicture());
    },
    userLogout: () => {
      dispatch(logout());
    },
  };
};

interface Props {
  setAccessToken: (accessToken: AuthResponse) => void;
  setGraphAccessToken: (graphAccessToken: AuthResponse) => void;
  getUserDetails: () => void;
  getOrgDetails: () => void;
  getProfilePicture: () => void;
  userLogout: () => void;
  isAuthenticated: boolean;
  user?: UserType;
  searchByTemplateName: string;
}

class App extends Component<Props, State> {
  userAgentApplication: UserAgentApplication;
  onIdle: () => any;

  constructor(props: Props) {
    super(props);
    initializeIcons();
    this.userAgentApplication = new UserAgentApplication({
      auth: {
        clientId: process.env.REACT_APP_ACMS_APP_ID!,
        redirectUri: process.env.REACT_APP_ACMS_REDIRECT_URI
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true
      }
    });

    let user = this.userAgentApplication.getAccount();

    this.state = {
      error: null
    };

    if (user) {
      // Enhance user object with data from Graph
      this.getUserInfo();
    }
    this.onIdle = this._onIdle.bind(this);
  }



  render() {
    let error = null;
    if (this.state.error) {
      error = (
        <ErrorMessage
          message={this.state.error.message}
          debug={this.state.error.debug}
        />
      );
    }

    return (
      <Router>
        <IdleTimer
          element={document}
          onIdle={this.onIdle}
          timeout={Constants.LOGOUT_TIMEOUT} />
        <Switch>
          <Route exact path="/preview/:uuid/:version">
            <Shared authButtonMethod={this.login}></Shared>
          </Route>
          <OuterAppWrapper>
            <SideBar
              authButtonMethod={
                this.props.isAuthenticated
                  ? this.logout
                  : this.login
              }
            />
            <MainAppWrapper>
              <NavBar />
              <MainApp>
                {!this.props.isAuthenticated && error}
                <Switch>
                  <Route exact path="/">
                    <Dashboard authButtonMethod={this.login} />
                  </Route>
                  <Route exact path="/designer/:uuid/:version">
                    <Designer authButtonMethod={this.login} />
                  </Route>
                  <Route path="/preview/:uuid">
                    <PreviewModal authButtonMethod={this.login} />
                  </Route>
                  <Route exact path="/templates/all">
                    <AllCards authButtonMethod={this.login} />
                  </Route>
                  <Route component={NoMatch} />
                </Switch>
              </MainApp>
            </MainAppWrapper>
          </OuterAppWrapper>
        </Switch>
        <div id="modal" />
      </Router >
    );
  }

  _onIdle() {
    if (this.props.isAuthenticated) {
      this.logout();
    }
  }

  login = async () => {
    try {
      await this.userAgentApplication.loginPopup({
        scopes: config.scopes,
        prompt: "select_account"
      });
      await this.getUserInfo();
    } catch (err) {
      let error = {};

      switch (true) {
        case typeof err === "string":
          let errParts = err.split("|");
          error =
            errParts.length > 1
              ? {
                message: errParts[1],
                debug: errParts[0]
              }
              : {
                message: err
              };
          break;
        case err instanceof ClientAuthError:
          error = {
            message: err.message,
            debug: JSON.stringify(err)
          };
          break;
        default:
          console.log("Unexpected authentication error: ", err);
      }

      this.setState({
        error: error
      });
    }
  };

  logout = () => {
    this.userAgentApplication.logout();
    this.props.userLogout();
  };

  getUserInfo = async () => {
    try {
      // Get the access token silently
      // If the cache contains a non-expired token, this function
      // will just return the cached token. Otherwise, it will
      // make a request to the Azure OAuth endpoint to get a token
      let accessToken = await this.userAgentApplication.acquireTokenSilent(
        {
          scopes: [`api://${process.env.REACT_APP_ACMS_APP_ID}/Templates.All`]
        }
      );
      this.props.setAccessToken(accessToken);

      let graphAccessToken = await this.userAgentApplication.acquireTokenSilent(
        {
          scopes: config.scopes
        }
      );
      this.props.setGraphAccessToken(graphAccessToken);

      this.props.getUserDetails();
      this.props.getOrgDetails();
      this.props.getProfilePicture();

    } catch (err) {
      let error: ErrorMessageProps;
      if (typeof err === "string") {
        let errParts = err.split("|");
        error =
          errParts.length > 1
            ? {
              message: errParts[1],
              debug: errParts[0]
            }
            : {
              message: err
            };
      } else {
        error = {
          message: err.message,
          debug: JSON.stringify(err)
        };
      }

      this.setState({
        error: error
      });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
