import styled from "styled-components";
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { ActionButton } from 'office-ui-fabric-react';

import { BREAK, COLORS } from "../../globalStyles";

export const Banner = styled.div`
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

export const EditButton = styled(IconButton).attrs({'aria-label': 'Edit Template Name'})`
  margin-left: 16px;
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
  font-size: 15px;
`;
