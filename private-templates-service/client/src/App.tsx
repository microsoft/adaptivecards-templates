import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { UserAgentApplication, ClientAuthError } from "msal";
import { initializeIcons } from '@uifabric/icons';

// Redux
import { connect } from "react-redux";
import { login, logout } from "./store/auth/actions";
import { UserType } from "./store/auth/types";
import { RootState } from "./store/rootReducer";

// Components
import Designer from "./components/Designer";
import NavBar from "./components/NavBar/NavBar";
import SideBar from "./components/SideBar";
import Dashboard from "./components/Dashboard";
import ErrorMessage, { ErrorMessageProps } from "./components/ErrorMessage/ErrorMessage";
import config from "./Config";
import { getUserDetails, getOrgDetails } from "./Services/GraphService";

// import { TemplateApi, NewTemplate } from 'adaptive-templating-service-typescript-node';


// CSS
import "bootstrap/dist/css/bootstrap.css";

import { OuterAppWrapper, MainAppWrapper, MainApp } from "./styled";

interface State {
  error: ErrorMessageProps | null;
}

const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    searchValue: state.search.searchValue
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    userLogin: (user: UserType) => {
      dispatch(login(user));
    },
    userLogout: () => {
      dispatch(logout());
    }
  };
};

interface Props {
  userLogin: (user: UserType) => void;
  userLogout: () => void;
  isAuthenticated: boolean;
  user?: UserType;
  searchValue: string,
}

class App extends Component<Props, State> {
  userAgentApplication: UserAgentApplication;

  constructor(props: Props) {
    super(props);
    initializeIcons();
    this.userAgentApplication = new UserAgentApplication({
      auth: {
        clientId: config.appId,
        redirectUri: config.redirectUri
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
      this.getUserProfile();
    }


    // // const defaultClient = ApiClient.instance;
    // // const bearer_auth = defaultClient.authentications['bearer_auth'];
    // // bearer_auth.apiKey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSJ9.eyJhdWQiOiI0ODAzZjY2YS0xMzZkLTQxNTUtYTUxZS02ZDk4NDAwZDU1MDYiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE1ODE0NzI1NzIsIm5iZiI6MTU4MTQ3MjU3MiwiZXhwIjoxNTgxNDc2NDcyLCJhaW8iOiI0Mk5nWUxCUFBLSzJMenQwbVVqZDNQc3RmRWRpQUE9PSIsImF6cCI6IjQ4MDNmNjZhLTEzNmQtNDE1NS1hNTFlLTZkOTg0MDBkNTUwNiIsImF6cGFjciI6IjEiLCJvaWQiOiI4Yzg1ZjgwNi03MDA1LTRlY2QtOGYxZS1kMWY3ODRmNThiOWMiLCJzdWIiOiI4Yzg1ZjgwNi03MDA1LTRlY2QtOGYxZS1kMWY3ODRmNThiOWMiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1dGkiOiJfTlJWUG1DWHNrS1laRnFFaXhFcEFBIiwidmVyIjoiMi4wIn0.WPIMtfep_Sae39EkNc9iNcqx66uuNEqYVJQ9DNTVfcH1Y5bdD1XZV8q_YOMzQBb7Akp9MijgBRzsl-zxDYQZP_R7XgERzyrayPGziwiVwB471vud52W0PPKa2dyw1Ityt9pNYZE4m6_oSKWjafPSMEZQkKYu_JEhoOKao440zXcoSUJe8VB4IdGLEE95bva7OJfrjiZ3a0rM9wYM3b_QHvQsP2NJS5aoaSwJ6guqfjw3ebhU0K_963IhS86nur6qezZLgcZWGTvSlImvUEhak-mOACgy0rgOYG9IotMaRWpJGtX8yqO10KHfsbDphEP1JtWca-B3Jirqzdgday34-A"
    // let api = new TemplateApi();
    // api.setApiKey(0, 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSJ9.eyJhdWQiOiI0ODAzZjY2YS0xMzZkLTQxNTUtYTUxZS02ZDk4NDAwZDU1MDYiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE1ODE0NzI1NzIsIm5iZiI6MTU4MTQ3MjU3MiwiZXhwIjoxNTgxNDc2NDcyLCJhaW8iOiI0Mk5nWUxCUFBLSzJMenQwbVVqZDNQc3RmRWRpQUE9PSIsImF6cCI6IjQ4MDNmNjZhLTEzNmQtNDE1NS1hNTFlLTZkOTg0MDBkNTUwNiIsImF6cGFjciI6IjEiLCJvaWQiOiI4Yzg1ZjgwNi03MDA1LTRlY2QtOGYxZS1kMWY3ODRmNThiOWMiLCJzdWIiOiI4Yzg1ZjgwNi03MDA1LTRlY2QtOGYxZS1kMWY3ODRmNThiOWMiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1dGkiOiJfTlJWUG1DWHNrS1laRnFFaXhFcEFBIiwidmVyIjoiMi4wIn0.WPIMtfep_Sae39EkNc9iNcqx66uuNEqYVJQ9DNTVfcH1Y5bdD1XZV8q_YOMzQBb7Akp9MijgBRzsl-zxDYQZP_R7XgERzyrayPGziwiVwB471vud52W0PPKa2dyw1Ityt9pNYZE4m6_oSKWjafPSMEZQkKYu_JEhoOKao440zXcoSUJe8VB4IdGLEE95bva7OJfrjiZ3a0rM9wYM3b_QHvQsP2NJS5aoaSwJ6guqfjw3ebhU0K_963IhS86nur6qezZLgcZWGTvSlImvUEhak-mOACgy0rgOYG9IotMaRWpJGtX8yqO10KHfsbDphEP1JtWca-B3Jirqzdgday34-A');

    // // api.templatePost(template, (error: any, data: any, resp: any) => {
    // //   console.log(error, data, resp);
    // // });

    // let newTemplate = new NewTemplate();

    // let template = `{
    //   "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    //   "version": "1.0",
    //   "type": "AdaptiveCard",
    //   "speak": "<s>Your flight is confirmed for you and 3 other passengers from San Francisco to Amsterdam on Friday, October 10 8:30 AM</s>",
    //   "body": [
    //     {
    //       "type": "ColumnSet",
    //       "spacing": "Medium",
    //       "columns": [
    //         {
    //           "type": "Column",
    //           "width": 1,
    //           "items": [
    //             {
    //               "type": "TextBlock",
    //               "text": "YEET",
    //               "size": "Medium",
    //               "isSubtle": true
    //             }
    //           ]
    //         },
    //         {
    //           "type": "Column",
    //           "width": 1,
    //           "items": [
    //             {
    //               "type": "TextBlock",
    //               "horizontalAlignment": "Right",
    //               "text": "THIS IS BOLDED TEXT",
    //               "size": "Medium",
    //               "weight": "Bolder"
    //             }
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // }`;
    // template = template.replace(/[\r\n]+/gm, "");
    // newTemplate.template = template;
    // // newTemplate.isPublished = false;
    // const resp = api.templatePost(newTemplate);
    // console.log(resp);

    // // console.log(api.templateGet());
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
        <OuterAppWrapper>
          <SideBar
            authButtonMethod={
              this.props.isAuthenticated
                ? this.logout
                : this.login
            }
          />
          <MainAppWrapper>
            <NavBar
            />
            <MainApp>
              {error}
              <Switch>
                <Route exact path="/">
                  <Dashboard authButtonMethod={this.login} />
                </Route>
                <Route exact path="/designer">
                  <Designer authButtonMethod={this.login} />
                </Route>
              </Switch>
            </MainApp>
          </MainAppWrapper>
        </OuterAppWrapper>
      </Router >
    );
  }

  login = async () => {
    try {
      await this.userAgentApplication.loginPopup({
        scopes: config.scopes,
        prompt: "select_account"
      });
      await this.getUserProfile();
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

  getUserProfile = async () => {
    try {
      // Get the access token silently
      // If the cache contains a non-expired token, this function
      // will just return the cached token. Otherwise, it will
      // make a request to the Azure OAuth endpoint to get a token

      let accessToken = await this.userAgentApplication.acquireTokenSilent(
        {
          scopes: config.scopes
        }
      );

      if (accessToken) {
        // Get the user's profile from Graph
        let user = await getUserDetails(accessToken);
        let org = await getOrgDetails(accessToken);
        if (org.value.length === 0) {
          org = null;
        } else {
          org = org.value[0].displayName;
        }

        this.props.userLogin({
          displayName: user.displayName,
          email: user.mail || user.userPrincipalName,
          organization: org
        });
      }
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
