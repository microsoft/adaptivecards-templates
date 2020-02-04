import styled from 'styled-components';
import { SearchBox,} from 'office-ui-fabric-react';

export const StyledSearchBox = styled(SearchBox)`

  background-color:#5C5C5C;
  width: 50%;
  color:white;

  :hover{
    border-color: #5C5C5C;
  }
  active:{
    border-color: white;
  }

`;