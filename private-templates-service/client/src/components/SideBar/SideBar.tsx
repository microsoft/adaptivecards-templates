import React from 'react';

import { useHistory } from 'react-router-dom';

import { connect } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { UserType } from '../../store/auth/types';
import { newTemplate } from '../../store/currentTemplate/actions';

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
  templateID: string | undefined;
  newTemplate: () => void;
}

const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    templateID: state.currentTemplate.templateID
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    newTemplate: () => {
      dispatch(newTemplate());
    }
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

const SideBar = (props: Props) => {
  const history = useHistory();

  const onNavClick = (event: any, element: any) => {
    event.preventDefault();
    if (element.url === "/designer") {
      props.newTemplate();
      console.log(props.templateID);
    }
    history.push(element.url);
  }

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
          {props.user && <UserAvatar iconSize="3rem" />}
          <Name>
            {props.user && props.user.displayName}
            <Title>{props.user && props.user.organization}</Title>
          </Name>
        </UserWrapper>
        {props.isAuthenticated && <NavMenu
          groups={navMenuLinks}
          onLinkClick={onNavClick}
        />}
      </MainItems>

      <SignOut onClick={props.authButtonMethod}>Sign {props.isAuthenticated ? 'Out' : 'In'}</SignOut>
    </OuterSideBarWrapper>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
