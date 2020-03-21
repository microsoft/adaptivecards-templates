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

export const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MiddleRowWrapper = styled.div`
  display: flex;
  direction: row;
`;

export const InfoWrapper = styled.div`
  display: flex;
  direction: column;
`;

export const CardWrapper = styled.div`
  flex: 0.47 0 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 3px 6px #00000029;
  padding: 8px 0px 16px;
  margin-bottom: 24px;
`;

export const ButtonWrapper = styled.div` 
  display: flex;
  direction: row;  
`;
export const StyledTitle = styled.h1`
  font-size: 2rem;
  font-weight: 500;
`;

export const Card = styled.div`
  pointer-events: none;
`;