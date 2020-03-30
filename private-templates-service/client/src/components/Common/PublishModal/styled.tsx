import styled from 'styled-components';
import { COLORS } from '../../../globalStyles';
import { DefaultButton } from 'office-ui-fabric-react';

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

export const Modal = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${COLORS.WHITE};
  width: 50%;
  padding: 48px;
`;

export const Header = styled.div`
  font-size: 1.375rem;
  font-weight: 500;
  margin-bottom: 12px;
`;

export const Description = styled.div`
  margin-bottom: 32px;
`;

export const DescriptionAccent = styled.span`
  color: ${COLORS.BLUE};
  white-space: nowrap;
`;

export const CenterPanelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 24px;
`;

export const CenterPanelLeft = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-right: 8px;
`;

export const AdaptiveCardPanel = styled.div`
  margin-bottom: 16px;
`;

export const CenterPanelRight = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-left: 8px;
`;

export const SemiBoldText = styled.div`
  font-size: 1rem;
  font-weight: 600;
`;

export const BottomRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
`;

export const NotifiedGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
`;

export const CancelButton = styled(DefaultButton)`
  margin-right: 12px;
`;
