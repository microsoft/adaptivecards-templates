import styled from "styled-components";
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { ActionButton } from 'office-ui-fabric-react';

import { BREAK, COLORS, FONTS } from "../../globalStyles";

export const Banner = styled.header`
  background-color: ${COLORS.WHITE};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  min-height: 61px;
  align-items: center;
  padding: 8px 40px;
  z-index: 2;
  -webkit-box-shadow: 0px 4px 3px 0px ${COLORS.GREY_BOX_SHADOW};
  -moz-box-shadow: 0px 4px 3px 0px ${COLORS.GREY_BOX_SHADOW};
  box-shadow: 0px 4px 3px 0px ${COLORS.GREY_BOX_SHADOW};

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

export const Styledh1 = styled.h1`
  letter-spacing: 0;
  opacity: 1;
  font-size: 1.875rem;
  margin-bottom: 0;
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};

  margin-right: 16px;
  @media only screen and (max-width: ${BREAK.SM}px) {
    font-size: 1.125rem;
  }
`;

export const Styledh2 = styled.h2`
  color: ${COLORS.WHITE};
  letter-spacing: 0;
  opacity: 1;
  font-size: 0.75rem;
  margin-bottom: 0;
  padding-left: 16px;

  @media only screen and (max-width: ${BREAK.SM}px) {
    font-size: 0.75rem;
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
  border: 0;
  outline: 0;

  &: focus {
    outline: 0px;
  }
`;

export const BackButton = styled(ActionButton)`
  &: focus {
    outline: 0px;
  }
`;

export const ButtonTextWrapper = styled.div`
  margin-left: 8px;
  font-size: 0.9375rem;
`;
