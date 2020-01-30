import React from "react";
import requireAuthentication from "../../requireAuthentication";

interface State {}

interface DashboardProps {
	isAuthenticated: boolean
	authButtonMethod: () => Promise<void>;
}

class Dashboard extends React.Component<DashboardProps, State> {
	render() {
		return <React.Fragment>DASHBOARD</React.Fragment>;
	}
}

export default requireAuthentication(Dashboard);
