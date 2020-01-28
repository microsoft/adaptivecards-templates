import React, { Component } from "react";
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";
import { Container } from "reactstrap";

import { UserAgentApplication, ClientAuthError } from "msal";

import NavBar from "./components/NavBar/NavBar";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import Welcome from "./components/Welcome/Welcome";
import Dashboard from "./components/Dashboard/Dashboard";
import config from "./Config";
import { getUserDetails, getOrgDetails } from "./Services/GraphService";
import { ErrorMessageProps } from "./components/ErrorMessage/ErrorMessage";

import "bootstrap/dist/css/bootstrap.css";

export interface UserType {
	displayName?: string;
	email?: string;
	organization?: string;
	avatar?: string;
}

// TODO: use react-redux
interface State {
	isAuthenticated: boolean;
	user: UserType;
	error: ErrorMessageProps | null;
}

class App extends Component<{}, State> {
	userAgentApplication: UserAgentApplication;

	constructor(props: {}) {
		super(props);

		console.log(JSON.stringify(props));

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

		var user = this.userAgentApplication.getAccount();

		this.state = {
			isAuthenticated: user !== null,
			user: {},
			error: null
		};

		if (user) {
			// Enhance user object with data from Graph
			this.getUserProfile();
		}
	}

	render() {
		let error: any = null;
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
				<div>
					<NavBar
						isAuthenticated={this.state.isAuthenticated}
						authButtonMethod={
							this.state.isAuthenticated
								? this.logout
								: this.login
						}
						user={this.state.user}
					/>
					<Route
						exact
						path="/"
						render={props => (
							<Container>
								{error}
								<Welcome
									{...props}
									isAuthenticated={this.state.isAuthenticated}
									user={this.state.user}
									authButtonMethod={this.login}
								/>
							</Container>
						)}
					/>
					<Route
						exact
						path="/designer"
						render={props => <div>DESIGNER PAGE</div>}
					/>
					<Route
						exact
						path="/dashboard"
						render={props => <Dashboard></Dashboard>}
					/>
				</div>
			</Router>
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
			var error = {};

			switch (true) {
				case typeof err === "string":
					var errParts = err.split("|");
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
				isAuthenticated: false,
				user: {},
				error: error
			});
		}
	};

	logout = () => {
		this.userAgentApplication.logout();
	};

	getUserProfile = async () => {
		try {
			// Get the access token silently
			// If the cache contains a non-expired token, this function
			// will just return the cached token. Otherwise, it will
			// make a request to the Azure OAuth endpoint to get a token

			var accessToken = await this.userAgentApplication.acquireTokenSilent(
				{
					scopes: config.scopes
				}
			);

			if (accessToken) {
				// Get the user's profile from Graph
				var user = await getUserDetails(accessToken);
				var org = await getOrgDetails(accessToken);
				if (org.value.length === 0) {
					org = null;
				} else {
					org = org.value[0].displayName;
				}
				this.setState({
					isAuthenticated: true,
					user: {
						displayName: user.displayName,
						email: user.mail || user.userPrincipalName,
						organization: org
					},
					error: null
				});
				window.history.pushState("", "", "/dashboard");
			}
		} catch (err) {
			var error = {};
			if (typeof err === "string") {
				var errParts = err.split("|");
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
				isAuthenticated: false,
				user: {},
				error: error
			});
		}
	};
}

export default App;
