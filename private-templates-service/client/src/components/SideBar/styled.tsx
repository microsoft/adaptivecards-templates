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

export const MainItems = styled.div``;

export const LogoWrapper = styled.div`
  height: 30px;
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
  
  color: ${COLORS.SECONDARY};

  font-weight: 600;
`;

export const Title = styled.div`
  align-self: flex-start;

  font-weight: 400;
  font-size: 11px;
`;

export const NavMenu = styled(Nav)`
`;

export const SignOut = styled(ActionButton)`
  margin: 24px;
`;
