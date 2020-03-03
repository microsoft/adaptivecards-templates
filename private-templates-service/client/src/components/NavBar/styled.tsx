import styled from "styled-components";
import { BREAK, COLORS } from "../../globalStyles";

export const Banner = styled.div`
  background-color: ${COLORS.WHITE};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  padding: 8px 40px;
  z-index: 2;
  -webkit-box-shadow: -2px 8px 3px -4px rgba(224, 224, 224, 1);
  -moz-box-shadow: -2px 8px 3px -4px rgba(224, 224, 224, 1);
  box-shadow: -2px 8px 3px -4px rgba(224, 224, 224, 1);

  @media only screen and (max-width: ${BREAK.SM}px) {
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

  @media only screen and (min-width: ${BREAK.SM}px) {
    display: none;
  }
`;

export const Styledh1 = styled.div`
  color: ${COLORS.BLACK};
  letter-spacing: 0;
  opacity: 1;
  font-size: 26px;
  margin-bottom: 0;
  font-weight: 600;

  @media only screen and (max-width: ${BREAK.SM}px) {
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
  background-color: ${COLORS.GREY1};
  width: 100px;
  display: table;
  min-height: -webkit-fill-available;
  border-radius: 3px;
`;

export const StyledButtonContent = styled.div`
  display: table-cell;
  vertical-align: middle;
  text-align: center;
`;
