import React, { ReactElement } from "react";
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

// Components
import { UserType } from '../../App';

// Styles
import "@fortawesome/fontawesome-free/css/all.css";
import { AvatarIcon, DefaultAvatarIcon } from './styled';

function UserAvatar(props: { user?: UserType }): ReactElement {
  // If a user avatar is available, return an img tag with the pic
  if (props.user && props.user.avatar) {
    return (
      <AvatarIcon
        src={props.user.avatar}
        alt="user"
        className="rounded-circle align-self-center mr-2"
      ></AvatarIcon>
    );
  }

  // No avatar available, return a default icon
  return (
    <DefaultAvatarIcon
      className="far fa-user-circle fa-lg rounded-circle align-self-center mr-2"
    ></DefaultAvatarIcon>
  );
}

function AuthNavItem(props: NavBarProps): ReactElement {
  // If authenticated, return a dropdown with the user's info and a
  // sign out button
  if (props.isAuthenticated && props.user) {
    return (
      <UncontrolledDropdown>
        <DropdownToggle nav caret>
          <UserAvatar user={props.user} />
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

export interface NavBarProps {
  isAuthenticated: boolean,
  authButtonMethod: () => void,
  user?: UserType,
}

interface NavBarState {
  isOpen: boolean
}

export default class NavBar extends React.Component<NavBarProps, NavBarState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <div>
        <Navbar color="dark" dark expand="md" fixed="top">
          <Container>
            <NavbarBrand href="/">Admin Portal</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <AuthNavItem
                  isAuthenticated={this.props.isAuthenticated}
                  authButtonMethod={
                    this.props.authButtonMethod
                  }
                  user={this.props.user}
                />
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}
