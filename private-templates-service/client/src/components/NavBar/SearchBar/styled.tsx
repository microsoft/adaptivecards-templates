import styled from "styled-components";
import { SearchBox } from "office-ui-fabric-react";
import { BREAK, COLORS } from "../../../globalStyles";
import * as STRINGS from "../../../assets/strings";

export const StyledSearchBox = styled(SearchBox).attrs({"ariaLabel": STRINGS.SEARCHBAR_DESCRIPTION})`
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
