import styled from 'styled-components';
import { FONTS } from '../../../globalStyles';

export const SearchAndFilter = styled.div`
  
  display: flex;
  flex-direction: row; 
  justify-content: space-between; 
  width: 30%;
`;

export const SearchResultBanner = styled.div`
  display:flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px 0;
`;

export const StyledSearchText = styled.div`
  letter-spacing 0;
  font-size: 1.625rem;
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};
`;

export const StyledSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
