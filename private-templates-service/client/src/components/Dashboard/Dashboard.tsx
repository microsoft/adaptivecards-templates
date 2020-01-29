import React from "react";
import { requireAuthentication } from "../../AuthenticatedComponent";

interface State {}

interface DashboardProps {
	isAuthenticated: boolean
}

class Dashboard extends React.Component<DashboardProps, State> {
	render() {
		return <React.Fragment>DASHBOARD</React.Fragment>;
	}
}

export default requireAuthentication(Dashboard);
