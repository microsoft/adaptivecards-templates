import styled from "styled-components";
import { COLORS } from "../../globalStyles";

import { ActionButton } from "office-ui-fabric-react";

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
`;

export const ErrorWrapper = styled.h1`
  color: #C0C0C0;
  font-size: 5rem;
  padding-bottom: 10px;
`

export const ErrorMessage = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 30px;
`

export const DashboardButton = styled(ActionButton)`
  background-color: ${COLORS.BLUE2};
  color: ${COLORS.WHITE};
`

