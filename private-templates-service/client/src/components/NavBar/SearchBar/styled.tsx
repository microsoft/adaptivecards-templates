import styled from 'styled-components';
import { SearchBox } from 'office-ui-fabric-react';
import { BREAK, COLORS } from '../../../globalStyles';

export const StyledSearchBox = styled(SearchBox)`
  width: 40%;
  border-color: ${COLORS.BLUE};
  border-radius: 4px;

  @media only screen and (max-width: ${BREAK.SM}px){
    border-radius: 16px;
    width: 33%;
    
    :hover {
      border-radius: 0px;
    }
  }
`;
