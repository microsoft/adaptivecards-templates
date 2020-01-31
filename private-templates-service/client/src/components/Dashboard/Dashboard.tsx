import React from "react";
import requireAuthentication from "../../utils/requireAuthentication";

import { RootState } from "../../store/rootReducer";
import { UserType } from "../../store/auth/types";
import { connect } from "react-redux";
import { ErrorMessageProps } from "../ErrorMessage/ErrorMessage";

const mapStateToProps = (state: RootState) => {
	return {
		isAuthenticated: state.auth.isAuthenticated,
		user: state.auth.user
	};
};

interface DashboardStates {
	error: ErrorMessageProps | null;
}

interface DashboardProps {
	isAuthenticated: boolean
	user?: UserType
	authButtonMethod: () => Promise<void>;
}

class Dashboard extends React.Component<DashboardProps, DashboardStates> {
	render() {
		return <React.Fragment>DASHBOARD</React.Fragment>;
	}
}

export default requireAuthentication(connect(mapStateToProps)(Dashboard));
