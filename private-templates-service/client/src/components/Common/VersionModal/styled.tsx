import styled from 'styled-components';
import { COLORS } from '../../../globalStyles';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';

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
  margin-bottom: 24px;
`;

export const BottomRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

export const LightButton = styled(DefaultButton)`
  margin-right: 12px;
`;

export const PrimaryStyleButton = styled(PrimaryButton)`
  margin-right: 12px;
`;

export const Card = styled.div`
  flex: 0.47 0 auto;
  display: flex;
  width: 100%;
  flex-direction: column;
  border: 1px solid ${COLORS.BORDER};
  padding: 8px 0px 16px;
  margin-bottom: 24px;
`;

export const CardHeaderRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid ${COLORS.BORDER};
`;

export const CardHeaderText = styled.div`
  font-weight: 600;
  flex-basis: 15%
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.875rem ;
  font-weight: 400;
  padding-top: 8px;
`;

export const DateWrapper = styled.div`
  display: flex;
  flex-basis: 15%
`

export const StatusWrapper = styled.div`
  display: flex;
  flex-basis: 15%;
  align-items: center;
` 

export const VersionWrapper = styled.div`
  display: flex;
  font-weight: 600;
  align-items: center;
  flex-basis: 15%;
`

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-basis: 15%;
`
export const VersionContainer = styled.div`
scroll-behavior: smooth;
width: 100%;
height: 200px;
display: flex;
flex-direction: column;
flex-wrap: nowrap;
justify-content: flex-start;
overflow-x: hidden;
overflow-y: auto;
-webkit-overflow-scrolling: touch;
`;