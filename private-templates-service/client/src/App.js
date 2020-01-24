// import React, { Component } from 'react';
// import logo from './logo.svg';

// class App extends Component {
// state = {
//     data: null
//   };

//   componentDidMount() {
//       // Call our fetch function below once the component mounts
//     this.callBackendAPI()
//       .then(res => this.setState({ data: res.express }))
//       .catch(err => console.log(err));
//   }
//     // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
//   callBackendAPI = async () => {
//     const response = await fetch('/express_backend');
//     const body = await response.json();

//     if (response.status !== 200) {
//       throw Error(body.message) 
//     }
//     return body;
//   };

//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <h1 className="App-title">Welcome to React</h1>
//         </header>
//         // Render the newly fetched data inside of this.state.data 
//         <p className="App-intro">{this.state.data}</p>
//       </div>
//     );
//   }
// }

// export default App;


import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import { Container } from "reactstrap";
import { UserAgentApplication } from "msal";
import NavBar from "./NavBar";
import ErrorMessage from "./ErrorMessage";
import Welcome from "./Welcome";
import config from "./Config";
import { getUserDetails, getOrgDetails } from "./GraphService";
import "bootstrap/dist/css/bootstrap.css";
import Dashboard from "./Dashboard";

class App extends Component {
	constructor(props) {
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
		let error = null;
		if (this.state.error) {
			error = (
				<ErrorMessage
					message={this.state.error.message}
					debug={this.state.error.debug}
				/>
			);
		}
		const renderDashboard = ()=>{
			if(this.state.isAuthenticated){
				return <Dashboard/>
			}
			else{
				return <Router>
				<div>
					<NavBar
						isAuthenticated={this.state.isAuthenticated}
						authButtonMethod={
							this.state.isAuthenticated
								? this.logout.bind(this)
								: this.login.bind(this)
						}
						user={this.state.user}
					/>{" "}
					<Container>
						{" "}
						{error}{" "}
						<Route
							exact
							path="/"
							render={props => (
								<Welcome
									{...props}
									isAuthenticated={this.state.isAuthenticated}
									user={this.state.user}
									authButtonMethod={this.login.bind(this)}
								/>
							)}
						/>{" "}
					</Container>{" "}
				</div>{" "}
			</Router>
			}
		}

		return (
			renderDashboard()
		);
	}

	setErrorMessage(message, debug) {
		this.setState({
			error: {
				message: message,
				debug: debug
			}
		});
	}

	async login() {
		try {
			await this.userAgentApplication.loginPopup({
				scopes: config.scopes,
				prompt: "select_account"
			});
			await this.getUserProfile();
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
	}

	logout() {
		this.userAgentApplication.logout();
	}

	async getUserProfile() {
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
				if (org.value.length == 0) {
					org = null;
				} else {
					org = org.value[0].displayName;
				}
				this.setState({
					isAuthenticated: true,
					user: {
						displayName: user.displayName,
						email: user.mail || user.userPrincipalName,
						email: user.mail || user.userPrincipalName,
						email: user.mail || user.userPrincipalName,
						organization: org
					},
					error: null
				});
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
	}
}

export default App;
