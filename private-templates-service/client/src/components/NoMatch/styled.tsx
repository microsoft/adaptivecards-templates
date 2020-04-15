import styled from "styled-components";
import { COLORS, FONTS } from "../../globalStyles";

export const Centered = styled.div`
  display: flex;
  flex-direction: column; 
  align-items: center;
`

export const OuterContainer = styled.div`
  height: calc(100vh - 61px);
  display: flex;
  justify-content: center;  
  align-items: center;
  padding-bottom: 60px;
`

export const ErrorWrapper = styled.h1`
  color: #808080;
  font-size: 5rem;
  font-weight: bold;
  padding-bottom: 10px;
`

export const ErrorMessage = styled.h1`
  font-size: 1.3rem;
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};
  margin-bottom: 30px;
`

export const DashboardButton = styled.button`
  background-color: ${COLORS.BLUE};
  color: ${COLORS.WHITE};
  border : none;
  padding: 10px;
`
