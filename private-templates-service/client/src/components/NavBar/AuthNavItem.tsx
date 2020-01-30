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
import UserAvatar from "./UserAvatar";
import { NavBarProps } from "./NavBar";

import { RootState } from "../../store/rootReducer";

const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: state.isAuthenticated,
    user: state.user
  };
};

function AuthNavItem(props: NavBarProps): ReactElement {
  // If authenticated, return a dropdown with the user's info and a
  // sign out button
  if (props.isAuthenticated && "displayName" in props.user) {
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

const VisibleAuthNavItem = connect(mapStateToProps)(AuthNavItem);

export default VisibleAuthNavItem;
