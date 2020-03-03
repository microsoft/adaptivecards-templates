import styled from "styled-components";
import { SearchBox } from "office-ui-fabric-react";
import { BREAK, COLORS } from "../../../globalStyles";

export const GREY_SEARCH_BAR_LIGHT = "#F3F3F3";
export const GREY_SEARCH_BAR_DARK = "#A1A1A1";

export const StyledSearchBox = styled(SearchBox)`
  width: 40%;
  background-color: ${GREY_SEARCH_BAR_LIGHT};
  border: none;
  @media only screen and (max-width: ${BREAK.SM}px) {
    width: 33%;

    :hover {
      border-radius: 0px;
    }
  }
`;
