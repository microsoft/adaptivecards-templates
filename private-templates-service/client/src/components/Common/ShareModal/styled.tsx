import styled from 'styled-components';
import { COLORS, FONTS } from '../../../globalStyles';
import { DefaultButton, Button } from 'office-ui-fabric-react';

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

export const Modal = styled.section`
  display: flex;
  flex-direction: column;
  background-color: ${COLORS.WHITE};
  width: 50%;
  padding: 48px;
`;

export const TopRowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const ToggleContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Header = styled.div`
  font-size: 1.375rem;
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};
  margin-bottom: 12px;
`;

export const Description = styled.div`
  margin-bottom: 32px;
`;

export const CenterPanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

export const ShareLinkPanel = styled.div`
  display: flex;
  flex-direction: column;
  height: 50%;
  margin-bottom: 8px;
`;

export const LinkRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 32px;
`;

export const TextFieldContainer = styled.div`
  width: 100%;
`;

export const StyledButton = styled.div`
  background-color: ${COLORS.GREY3};
  width: 100px;
  display: table;
  height: 32px;
`;

export const EmailPanel = styled.div`
  display: flex;
  flex-direction: column;
  height: 50%;
  margin-top: 20px;
`;

export const SemiBoldText = styled.div`
  font-size: 1rem;
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};
`;

export const BottomRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-end;
  margin-top: 50px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
`;

export const CancelButton = styled(DefaultButton)`
  margin-right: 12px;
  &: focus {
    outline: 0px;
  }
`;

export const SendMailButton = styled(DefaultButton)`
  max-width: fit-content;
  &: focus {
    outline: 0px;
  }
`;

export const CopyLinkButton = styled(Button)`
  min-width: fit-content;
  &: focus {
    outline: 0px;
  }
`;
