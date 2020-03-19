import styled from "styled-components";
import { COLORS } from '../../../globalStyles';

export const Card = styled.div`
  /* Disables buttons on adaptive card */
  pointer-events: none;
  background: ${COLORS.WHITE};
`;
