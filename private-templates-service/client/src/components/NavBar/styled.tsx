import styled from 'styled-components';
import { BREAK, COLORS } from '../../globalStyles';

export const Banner = styled.div`
  background-color: ${COLORS.BLUE};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  padding: 8px 40px;
  z-index: 2;

  @media only screen and (max-width: ${BREAK.SM}px){
    padding: 8px 24px;
  }
`;

export const MobileBanner = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const StyledLogo = styled.img`
  width: 32px;
  margin-right: 10px;

  @media only screen and (min-width: ${BREAK.SM}px){
    display: none;
  }
`;

export const Styledh1 = styled.div`
  color: ${COLORS.WHITE};
  letter-spacing: 0;
  opacity: 1;
  font-size: 26px;
  margin-bottom: 0;
  font-weight: 600;

  @media only screen and (max-width: ${BREAK.SM}px){
    font-size: 18px;
  }
`;
