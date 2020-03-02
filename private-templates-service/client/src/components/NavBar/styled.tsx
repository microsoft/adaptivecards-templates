import styled from 'styled-components';
import { BREAK, COLORS } from '../../globalStyles';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

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

export const Styledh2 = styled.div`
  color: ${COLORS.WHITE};
  letter-spacing: 0;
  opacity: 1;
  font-size: 12px;
  margin-bottom: 0;
  padding-left: 16px;
  font-weight: 300;

  @media only screen and (max-width: ${BREAK.SM}px){
    font-size: 12px;
  }
`;

export const StyledButton = styled.div`
  width: 150;
  display: table;
  min-height: -webkit-fill-available;
  border-radius: 3px;
`;

export const StyledButtonContent = styled.div`
  display: table-cell;
  vertical-align: middle;
  text-align: center;
`;

export const CancelIcon = styled(Icon)`
  padding-top: 1.6px;
  font-size: 1.1rem;
  font-weight: lighter;
`;

export const CancelText = styled.div`
  padding: 3.45px 0px 0px  10px;
  color: ${COLORS.GREY1};
  font-size: 0.95rem;
  font-weight: lighter;
  `;

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  color: ${COLORS.GREY1};
  `;
