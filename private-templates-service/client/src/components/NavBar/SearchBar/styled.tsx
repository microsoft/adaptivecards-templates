import styled from "styled-components";
import { SearchBox } from "office-ui-fabric-react";
import { BREAK, COLORS } from "../../../globalStyles";

export const StyledSearchBox = styled(SearchBox)`
  width: 40%;
  background-color: ${COLORS.GREYHOVER};
  border: none;
  @media only screen and (max-width: ${BREAK.SM}px) {
    width: 33%;

    :hover {
      border-radius: 0px;
    }
  }
`;
