import styled from "styled-components";
import { IconButton } from 'office-ui-fabric-react/lib/Button';

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
  -webkit-box-shadow: -2px 8px 3px -4px ${COLORS.GREY_BOX_SHADOW};
  -moz-box-shadow: -2px 8px 3px -4px ${COLORS.GREY_BOX_SHADOW};
  box-shadow: -2px 8px 3px -4px ${COLORS.GREY_BOX_SHADOW};

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

export const BaselineBanner = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: baseline;
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
  font-size: 30px;
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

  @media only screen and (max-width: ${BREAK.SM}px) {
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

export const EditButton = styled(IconButton)`
  margin-left: 16px;
  border: 0;
  outline: 0;

  &: focus {
    outline: 0px;
  }
`;
