import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { UserAgentApplication, ClientAuthError } from "msal";
import { AuthResponse } from 'msal';
import { initializeIcons } from '@uifabric/icons';
import IdleTimer from 'react-idle-timer';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory } from "history";

// Redux
import { connect } from "react-redux";
import { setAccessToken, setGraphAccessToken, getUserDetails, getOrgDetails, getProfilePicture, logout, getConfig } from "./store/auth/actions";
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
    redirectUri: state.auth.redirectUri,
    appId: state.auth.appId,
    appInsightsInstrumentationKey: state.auth.appInsightsInstrumentationKey,
    userInsightsInstrumentationKey: state.auth.userInsightsInstrumentationKey,
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
    getConfig: () => {
      dispatch(getConfig());
    }
  };
};

interface Props {
  setAccessToken: (accessToken: AuthResponse) => void;
  setGraphAccessToken: (graphAccessToken: AuthResponse) => void;
  getUserDetails: () => void;
  getOrgDetails: () => void;
  getProfilePicture: () => void;
  userLogout: () => void;
  getConfig: () => void;
  isAuthenticated: boolean;
  user?: UserType;
  appId?: string;
  redirectUri?: string;
  appInsightsInstrumentationKey?: string;
  userInsightsInstrumentationKey?: string;
}

function telemetryHelper(appID: string, instrumentationKey: string) {
  const browserHistory = createBrowserHistory({ basename: appID });
  var reactPlugin = new ReactPlugin();
  var appInsights = new ApplicationInsights({
    config: {
      instrumentationKey: instrumentationKey,
      extensions: [reactPlugin],
      extensionConfig: {
        [reactPlugin.identifier]: { history: browserHistory }
      }
    }
  });
  appInsights.loadAppInsights();

}

class App extends Component<Props, State> {
  userAgentApplication?: UserAgentApplication;
  onIdle: () => any;

  componentDidUpdate() {
    if (!this.userAgentApplication && this.props.appId && this.props.redirectUri) {
      this.userAgentApplication = new UserAgentApplication({
        auth: {
          clientId: this.props.appId!,
          redirectUri: this.props.redirectUri
        },
        cache: {
          cacheLocation: "localStorage",
          storeAuthStateInCookie: true
        }
      });

      let user = this.userAgentApplication.getAccount();

      if (user) {
        // Enhance user object with data from Graph
        this.getUserInfo();
      }

      if (this.props.appInsightsInstrumentationKey) {
        telemetryHelper(this.props.appId, this.props.appInsightsInstrumentationKey);
      }

      if (this.props.userInsightsInstrumentationKey) {
        telemetryHelper(this.props.appId, this.props.userInsightsInstrumentationKey);
      }
    }
  }

  constructor(props: Props) {
    super(props);
    initializeIcons();
    this.getConfigInfo();
    this.state = {
      error: null
    };
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
        {this.props.appId && this.props.redirectUri &&
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
                    <Route path="/templates/all">
                      <AllCards authButtonMethod={this.login} />
                    </Route>
                    <Route component={NoMatch} />
                  </Switch>
                </MainApp>
              </MainAppWrapper>
            </OuterAppWrapper>
          </Switch>}
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
      await this.userAgentApplication!.loginPopup({
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
    this.userAgentApplication!.logout();
    this.props.userLogout();
  };

  getConfigInfo = async () => {
    this.props.getConfig();
  }

  getUserInfo = async () => {
    try {
      // Get the access token silently
      // If the cache contains a non-expired token, this function
      // will just return the cached token. Otherwise, it will
      // make a request to the Azure OAuth endpoint to get a token
      let accessToken = await this.userAgentApplication!.acquireTokenSilent(
        {
          scopes: [`api://${this.props.appId}/Templates.All`]
        }
      );
      this.props.setAccessToken(accessToken);

      let graphAccessToken = await this.userAgentApplication!.acquireTokenSilent(
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
