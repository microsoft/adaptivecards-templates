import styled from 'styled-components';
import { COLORS, FONTS } from '../../../globalStyles';
import { DefaultButton, PrimaryButton, TextField } from 'office-ui-fabric-react';

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
  width: 60%;
  padding: 48px;
`;

export const ColumnWrapper = styled.form`
  display: flex;
  flex-direction: column;
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

export const MiddleRowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 32px;
`;

export const InfoWrapper = styled.div`
  display: flex;
  flex: 1 1 200px;
  flex-direction: column;
`;

export const TemplateFooterWrapper = styled.div`
  padding: 10px 0px 10px 20px;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  border-top: 1px solid ${COLORS.BORDER2};
`;

export const TemplateNameWrapper = styled.div`
  flex: 0.8;
  display: flex;
  flex-direction: row;
  align-items: baseline;
`;

export const StyledH3 = styled.h3`
  font-size: 0.85rem;
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};
`;

export const ButtonWrapper = styled.div` 
  display: flex;
  direction: row; 
  justify-content: flex-end; 
`;
export const StyledTitle = styled.h1`
  font-size: 1.5rem;
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};
  `;

export const Card = styled.div`
  pointer-events: none;
`;

export const TagsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const StyledSaveButton = styled(PrimaryButton)`
  margin-left: 5px;
  min-width: 125px
`;

export const StyledCancelButton = styled(DefaultButton)`
  margin-right: 5px;
  min-width: 125px
`;

export const StyledTextField = styled(TextField)`
  margin-bottom: 15px;
`;
