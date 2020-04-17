import styled from 'styled-components';
import { COLORS, FONTS } from '../../../globalStyles';

import { TextField, PrimaryButton, DefaultButton } from 'office-ui-fabric-react';

export const BackDrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Modal = styled.form`
  display: flex;
  flex-direction: column;
  background-color: ${COLORS.WHITE};
  width: 60%;
  padding: 48px;
`;

export const Header = styled.div`
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};
  font-size: 1.75rem;
  font-weight: 500;
  margin-bottom: 12px;
`;

export const Description = styled.div`
  font-family: ${FONTS.SEGOE_UI_REGULAR};
  margin-bottom: 32px;
`;

export const DescriptionAccent = styled.span`
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};
  color: ${COLORS.BLUE};
  white-space: nowrap;
`;

export const CenterPanelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 24px;
`;

export const CenterPanelLeft = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-right: 8px;
`;

export const CenterPanelRight = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-left: 8px;
`;

export const Card = styled.div`
  pointer-events: none;
`;

export const StyledH3 = styled.h3`
  font-size: 0.85rem;
  font-weight: 500;
`;

export const StyledTextField = styled(TextField)`
  margin-bottom: 15px;
`;

export const TagsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const BottomRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-end;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
`;

export const PublishButton = styled(PrimaryButton)`
  font-family: ${FONTS.SEGOE_UI_REGULAR};
  min-width: 150px;
`;

export const CancelButton = styled(DefaultButton)`
  font-family: ${FONTS.SEGOE_UI_REGULAR};
  margin-right: 12px;
  min-width: 150px;
`;
