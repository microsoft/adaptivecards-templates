import styled from 'styled-components';

import { Nav } from 'office-ui-fabric-react/lib/Nav';
import { ActionButton } from 'office-ui-fabric-react';

export const OuterSideBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 260px;

  z-index: 1;
  -webkit-box-shadow: 3px 0px 3px 0px rgba(228,228,228,1);
  -moz-box-shadow: 3px 0px 3px 0px rgba(228,228,228,1);
  box-shadow: 3px 0px 3px 0px rgba(228,228,228,1);
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

export const DefaultAvatarIcon = styled.i`
  width: 32px;
`;

export const Name = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  
  color: #606060;

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
