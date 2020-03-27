import React from "react";

import { useHistory } from "react-router-dom";

import { connect } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { UserType } from "../../store/auth/types";
import { newTemplate } from "../../store/currentTemplate/actions";
import { COLORS } from "../../globalStyles";
import UserAvatar from "./UserAvatar";
import mainLogo from "../../assets/adaptive-cards-100-logo.png";
import * as STRINGS from "../../assets/strings";

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
import { ClearOwners } from "../../store/templateOwner/actions";

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
    color: COLORS.WHITE
  }
};

const iconStyle = {
  color: COLORS.WHITE,
  margin: "0px 10px 0px 40px"
};

const iconStylePink = {
  color: 'pink',
  margin: "0px 10px 0px 40px"
}

const navMenuLinks: INavLinkGroup[] = [
  {
    links: [
      {
        name: "Dashboard",
        url: "/",
        iconProps: {
          iconName: "ViewDashboard",
          style: iconStyle
        }
      },
      {
        name: "New Template",
        url: "/designer",
        iconProps: {
          iconName: "CalculatorAddition",
          style: iconStyle
        }
      },
      {
        name: "All Templates",
        url: "/dashboard/all",
        iconProps: {
          iconName: "ViewList",
          style: iconStylePink
        }
      },
      {
        name: "Drafts",
        url: "/drafts",
        iconProps: {
          iconName: "SingleColumnEdit",
          style: iconStylePink
        }
      },
      {
        name: "Published",
        url: "/published",
        iconProps: {
          iconName: "PublishContent",
          style: iconStylePink
        }
      },
      {
        name: "Tags",
        url: "/tags",
        iconProps: {
          iconName: "Tag",
          style: iconStylePink
        }
      }
    ]
  }
];

const SideBar = (props: Props) => {
  const history = useHistory();

  const onNavClick = (event: any, element: any) => {
    event.preventDefault();
    if (element.url === "/designer") {
      props.newTemplate();
    }
    else if (element.url === "/") {
      ClearOwners();
    }
    history.push(element.url);
  };

  return (
    <OuterSideBarWrapper>
      <MainItems>
        <LogoWrapper>
          <Logo aria-label={STRINGS.LOGO_DESCRIPTION} src={mainLogo} />
          <LogoTextWrapper>
            <LogoTextHeader>Adaptive Cards</LogoTextHeader>
            <LogoTextSubHeader>Portal</LogoTextSubHeader>
          </LogoTextWrapper>
        </LogoWrapper>
        <UserWrapper>
          {props.user && <UserAvatar iconSize="2.25rem" />}
          <Name>
            {props.user && props.user.displayName}
            <Title>{props.user && props.user.organization}</Title>
          </Name>
        </UserWrapper>
        {props.isAuthenticated && <NavMenu styles={navMenuLinksProps} groups={navMenuLinks} onLinkClick={onNavClick} />}
      </MainItems>

      <SignOut onClick={props.authButtonMethod}>Sign {props.isAuthenticated ? "Out" : "In"}</SignOut>
    </OuterSideBarWrapper>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
