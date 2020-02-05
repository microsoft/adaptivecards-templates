import React from 'react';
import { connect } from 'react-redux';

import { RootState } from '../../store/rootReducer';
import { UserType } from '../../store/auth/types';
import { UserAvatar } from './UserAvatar';
import mainLogo from '../../assets/adaptive-cards-100-logo.png';

// CSS
import {
  OuterSideBarWrapper,
  LogoWrapper,
  UserWrapper,
  Name,
  Title,
  NavMenu,
  MainItems,
  SignOut,
  Logo,
  LogoTextWrapper,
  LogoTextHeader,
  LogoTextSubHeader
} from './styled';

interface Props {
  authButtonMethod: () => void;
  isAuthenticated: boolean;
  user?: UserType;
}

const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
  }
}

const navMenuLinks = [{
  links: [
    {
      name: 'Dashboard',
      url: '/',
    }, {
      name: 'New Template',
      url: '/designer',
    }, {
      name: 'All Templates',
      url: '/dashboard/all',
    }, {
      name: 'Drafts',
      url: '/drafts',
    }, {
      name: 'Published',
      url: '/published',
    }
  ]
}]

class SideBar extends React.Component<Props, {}> {

  render() {
    return (
      <OuterSideBarWrapper>
        <MainItems>
          <LogoWrapper>
            <Logo src={mainLogo} />
            <LogoTextWrapper>
              <LogoTextHeader>Adaptive Cards</LogoTextHeader>
              <LogoTextSubHeader>Portal</LogoTextSubHeader>
            </LogoTextWrapper>
          </LogoWrapper>
          <UserWrapper>
            {this.props.user && <UserAvatar iconSize="3rem" />}
            <Name>
              {this.props.user && this.props.user.displayName}
              <Title>{this.props.user && this.props.user.organization}</Title>
            </Name>
          </UserWrapper>
          {this.props.isAuthenticated && <NavMenu
            groups={navMenuLinks}
          />}
        </MainItems>

        <SignOut onClick={this.props.authButtonMethod}>Sign {this.props.isAuthenticated ? 'Out' : 'In'}</SignOut>
      </OuterSideBarWrapper>
    )
  }
}

export default connect(mapStateToProps)(SideBar);
