import React from "react";
import { useHistory } from "react-router-dom";

import { connect } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { UserType, AuthState } from "../../store/auth/types";
import { ModalState } from "../../store/page/types";
import { newTemplate } from "../../store/currentTemplate/actions";

import { COLORS, FONTS } from "../../globalStyles";
import UserAvatar from "./UserAvatar";
import mainLogo from "../../assets/adaptive-cards-100-logo.png";
import * as STRINGS from "../../assets/strings";
import KeyCode from '../../globalKeyCodes'

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
} from "./styled";
import { INavLinkGroup, INavStyles } from "office-ui-fabric-react";
import SkipLink from "../Common/SkipLink";
import { NAVBAR, OUT, IN, ADAPTIVE_CARDS, PORTAL, ARIA_DASHBOARD, ARIA_NEW_CARD } from "../../assets/strings";


interface Props {
  authButtonMethod: () => void;
  auth: AuthState
  user?: UserType;
  templateID: string | undefined;
  newTemplate: () => void;
  modalState?: ModalState;
}

const mapStateToProps = (state: RootState) => {
  return {
    auth: state.auth,
    user: state.auth.user,
    templateID: state.currentTemplate.templateID,
    modalState: state.page.modalState
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    newTemplate: () => {
      dispatch(newTemplate());
    }
  };
};
const navMenuLinksProps: Partial<INavStyles> = {
  link: {
    selectors: {
      ".ms-Nav-compositeLink:hover &": {
        backgroundColor: COLORS.BLUE2,
        textDecoration: "none"
      },
      ".ms-Nav-compositeLink.is-selected &": {
        background: COLORS.BLUE2
      }
    }
  },
  linkText: {
    color: COLORS.WHITE,
    fontSize: "0.875rem",
    fontFamily: FONTS.SEGOE_UI_REGULAR,
  }
};

const iconStyle = {
  color: COLORS.WHITE,
  margin: "0px 10px 0px 40px"
};

export const newTemplateURL = "/designer/newcard/1.0"

const navMenuLinks: INavLinkGroup[] = [
  {
    links: [
      {
        name: STRINGS.DASHBOARD,
        url: "/",
        iconProps: {
          iconName: "ViewDashboard",
          style: iconStyle
        },
        title: "",
        ariaLabel: ARIA_DASHBOARD
      },
      {
        name: STRINGS.NEW_CARD,
        url: newTemplateURL,
        iconProps: {
          iconName: "CalculatorAddition",
          style: iconStyle
        },
        title: "",
        ariaLabel: ARIA_NEW_CARD
      },
      {
        name: STRINGS.ALL_CARDS,
        url: "/templates/all",
        iconProps: {
          iconName: "ViewList",
          style: iconStyle
        },
        title: "",
        ariaLabel: "Link to All Cards"
      }
    ]
  }
];

const SideBar = (props: Props) => {
  const history = useHistory();

  const onNavClick = (event: any, element: any) => {
    event.preventDefault();
    if (element.url === newTemplateURL) {
      props.newTemplate();
    }
    history.push(element.url);

  };


  const onLogoClick = () => {
    history.push("/");
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === KeyCode.ENTER) {
      history.push("/");
    }
  }
  
  return (
    <OuterSideBarWrapper aria-label={NAVBAR}>
      <MainItems>
        <LogoWrapper onClick={onLogoClick} tabIndex={props.modalState ? -1 : 0} onKeyDown={onKeyDown}>
          <Logo aria-label={STRINGS.LOGO_DESCRIPTION} src={mainLogo} />
          <LogoTextWrapper>
            <LogoTextHeader>{ADAPTIVE_CARDS}</LogoTextHeader>
            <LogoTextSubHeader>{PORTAL}</LogoTextSubHeader>
          </LogoTextWrapper>
        </LogoWrapper>
        <UserWrapper>
          {props.user && <UserAvatar iconSize="2.25rem" />}
          <Name>
            {props.user && props.user.displayName}
            <Title>{props.user && props.user.organization}</Title>
          </Name>
        </UserWrapper>
        {props.auth.isAuthenticated && props.auth.graphAccessToken && <NavMenu styles={navMenuLinksProps} groups={navMenuLinks} onLinkClick={onNavClick} />}
        {props.auth.isAuthenticated && props.auth.graphAccessToken && <SkipLink />}
      </MainItems>

      <SignOut onClick={props.authButtonMethod} tabIndex={props.modalState ? -1 : 0}>{STRINGS.SIGN} {props.auth.isAuthenticated ? `${OUT}` : `${IN}`}</SignOut>
    </OuterSideBarWrapper>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
