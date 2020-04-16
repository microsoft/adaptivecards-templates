import styled from "styled-components";
import { Nav } from "office-ui-fabric-react/lib/Nav";
import { Icon } from "office-ui-fabric-react/lib/Icon";
import { ActionButton } from "office-ui-fabric-react";
import { COLORS, BREAK, FONTS } from "../../globalStyles";

export const OuterSideBarWrapper = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 260px;

  z-index: 2;
  -webkit-box-shadow: 3px 0px 3px 0px ${COLORS.GREY_BOX_SHADOW};
  -moz-box-shadow: 3px 0px 3px 0px ${COLORS.GREY_BOX_SHADOW};
  box-shadow: 3px 0px 3px 0px ${COLORS.GREY_BOX_SHADOW};

  @media only screen and (max-width: ${BREAK.SM}px) {
    display: none;
  }
  color: white;
  background-color: ${COLORS.BLUE};
`;

export const MainItems = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-self: center;
  align-items: center;
  margin-top: 20px;
  padding-right: 48px;
  cursor: pointer;
`;

export const Logo = styled.img`
  width: 32px;
  margin-right: 12px;
`;

export const LogoTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
  line-height: 1rem;
`;

export const LogoTextHeader = styled.div`
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};
`;

export const LogoTextSubHeader = styled.div`
  color: ${COLORS.GREY5};
  font-family: ${FONTS.SEGOE_UI_REGULAR};
`;

export const UserWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 60px 0;
`;

export const AvatarIcon = styled.img`
  width: 80px;
  margin-bottom: 16px;
`;

export const DefaultAvatarIcon = styled(Icon) <{ size?: string }>`
  font-size: ${props => props.size || "1rem"};
  align-self: center;
`;

export const Name = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  font-size: 1.125rem;

  color: ${COLORS.WHITE};
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};

`;

export const Title = styled.div`
  align-self: flex-start;
  font-size: 0.75rem;
  font-family: ${FONTS.SEGOE_UI_REGULAR};
`;

export const NavMenu = styled(Nav)`
  link: [ {
    color: white;
  }]
`;

export const SignOut = styled(ActionButton)`
  margin: 24px;
  color: ${COLORS.WHITE};
`;