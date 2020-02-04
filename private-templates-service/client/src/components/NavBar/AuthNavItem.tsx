import React, { ReactElement } from "react";
import { connect } from "react-redux";

import {
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import UserAvatar from "../SideBar/UserAvatar";

import { UserType } from "../../store/auth/types";
import { RootState } from "../../store/rootReducer";

interface AuthNavItemProps {
  authButtonMethod: () => void;
  isAuthenticated: boolean;
  user?: UserType;
}

const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
  };
};

function AuthNavItem(props: AuthNavItemProps): ReactElement {
  // If authenticated, return a dropdown with the user's info and a
  // sign out button
  if (props.user) {
    return (
      <UncontrolledDropdown>
        <DropdownToggle nav caret>
          <UserAvatar />
        </DropdownToggle>
        <DropdownMenu right>
          <h5 className="dropdown-item-text mb-0">
            {props.user.displayName}
          </h5>
          <p className="dropdown-item-text text-muted mb-0">
            {props.user.email}
          </p>
          <DropdownItem divider />
          <DropdownItem onClick={props.authButtonMethod}>
            Sign Out
					</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }
  // Not authenticated, return a sign in link
  return (
    <NavItem>
      <NavLink onClick={props.authButtonMethod}>Sign In</NavLink>
    </NavItem>
  );
}

export default connect(mapStateToProps)(AuthNavItem);
