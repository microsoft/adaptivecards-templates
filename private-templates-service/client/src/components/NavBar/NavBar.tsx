import React from "react";
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav
} from "reactstrap";

// Redux
import { connect } from "react-redux";
import { RootState } from "../../store/rootReducer";

// Components
import { UserType } from "../../store/auth/types";
import AuthNavItem from "./AuthNavItem";

// Styles
import "@fortawesome/fontawesome-free/css/all.css";

interface NavBarProps {
  authButtonMethod: () => void;
  isAuthenticated: boolean;
  user?: UserType;
}

interface State {
  isOpen: boolean;
}

const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
  };
};

class NavBar extends React.Component<NavBarProps, State> {
  constructor(props: NavBarProps) {
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
                  authButtonMethod={
                    this.props.authButtonMethod
                  }
                />
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

export default connect(mapStateToProps)(NavBar);
