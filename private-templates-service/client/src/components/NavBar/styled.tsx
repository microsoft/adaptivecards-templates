import styled from 'styled-components';
import {BREAK} from '../../globalStyles';

export const Banner = styled.div`
  background-color: #6F6F6F;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  padding: 8px 64px;
  z-index: 1;

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

export const Logo = styled.img`
  display: none;

  @media only screen and (max-width: ${BREAK.SM}px){
    width: 32px;
    display: block;
    margin-right: 10px;
  }
`;

export const Styledh1 = styled.div`
  color: #FFFFFF;
  letter-spacing: 0;
  opacity: 1;
  font-size: 32px;
  margin-bottom: 0;
  font-weight: 600;

  @media only screen and (max-width: ${BREAK.SM}px){
    font-size: 18px;
  }
`;