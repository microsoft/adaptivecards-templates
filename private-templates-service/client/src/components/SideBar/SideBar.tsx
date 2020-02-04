import React from 'react';
import { connect } from 'react-redux';

import { RootState } from '../../store/rootReducer';
import { UserType } from '../../store/auth/types';
import { UserAvatar } from './UserAvatar';
import mainLogo from '../../assets/adaptive-cards-100-logo.png';

// CSS
import { OuterSideBarWrapper, LogoWrapper, UserWrapper, Name, Title, NavMenu, MainItems, SignOut, Logo, LogoTextWrapper, LogoTextHeader, LogoTextSubHeader } from './styled';



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
      key: 'key1',
    }, {
      name: 'New Template',
      url: '/dashboard/new',
      key: 'key2',
    }, {
      name: 'All Templates',
      url: '/dashboard/all',
      key: 'key3',
    }, {
      name: 'Drafts',
      url: '/drafts',
      key: 'key4',
    }, {
      name: 'Published',
      url: '/published',
      key: 'key5',
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
