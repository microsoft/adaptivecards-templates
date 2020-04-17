import styled, { keyframes } from "styled-components";
import { COLORS } from "../../../../globalStyles";
import { Icon } from "office-ui-fabric-react";

const DuplicateKeyFrame = keyframes`
  from {
    background-color: ${COLORS.BLUE};
  }

  to {
    background-color: ${COLORS.GREY2};
  }
`;

export const TagBodyContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  background-color: ${COLORS.GREY2};
  border-radius: 1em;
  margin: 0 16px 12px 0;
  padding: 4px 10px 4px 16px;
  cursor: default;
  &.duplicate {
    animation: ${DuplicateKeyFrame} 0.3s forwards;
  }
`;

export const TagSetFavouriteIcon = styled(Icon)`
margin-right: 10px;
`;