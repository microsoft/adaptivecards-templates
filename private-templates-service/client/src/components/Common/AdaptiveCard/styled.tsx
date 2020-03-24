import styled from "styled-components";
import { COLORS } from '../../../globalStyles';

export const Card = styled.div<{ hoverEffect: boolean }>`
  /* Disables buttons on adaptive card */
  pointer-events: none;
  ${props => !props.hoverEffect && `background: ${COLORS.WHITE}`}
`;
