import styled from 'styled-components';

import { Nav } from 'office-ui-fabric-react/lib/Nav';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { ActionButton } from 'office-ui-fabric-react';

import { COLORS, BREAK } from '../../globalStyles';

export const OuterSideBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 260px;

  z-index: 1;
  -webkit-box-shadow: 3px 0px 3px 0px rgba(228,228,228,1);
  -moz-box-shadow: 3px 0px 3px 0px rgba(228,228,228,1);
  box-shadow: 3px 0px 3px 0px rgba(228,228,228,1);

  @media only screen and (max-width: ${BREAK.SM}) {
    display: none;
  }
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
  margin-top: 32px;
  padding-right: 48px;
`;

export const Logo = styled.img`
  width: 32px;
  margin-right: 12px;
`;

export const LogoTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  line-height: 1rem;
`;

export const LogoTextHeader = styled.div`
  font-weight: 500;
`;
export const LogoTextSubHeader = styled.div`
  font-weight: 300;
`;

export const UserWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 48px 0;
`

export const AvatarIcon = styled.img`
  width: 32px;
`;

export const DefaultAvatarIcon = styled(Icon) <{ size?: string }>`
  font-size: ${props => props.size || "1rem"};
  align-self: center;
`;

export const Name = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  font-size: 18px;

  color: ${COLORS.SECONDARY};

  font-weight: 600;
`;

export const Title = styled.div`
  align-self: flex-start;

  font-weight: 400;
  font-size: 12px;
`;

export const NavMenu = styled(Nav)`
`;

export const SignOut = styled(ActionButton)`
  margin: 24px;
`;
