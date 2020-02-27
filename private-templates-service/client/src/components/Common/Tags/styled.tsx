import styled, { css, keyframes } from 'styled-components';
import { COLORS } from '../../../globalStyles';

import { Icon } from 'office-ui-fabric-react';

export const Tag = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  color: white;
  background-color: ${COLORS.BLUE};
  border-radius: 1em;
  margin: 0 16px 12px 0;
  padding: 4px 10px 4px 16px;
`;

export const TagText = styled.div``;

export const TagCloseIcon = styled(Icon)`
  font-size: 10px;
  margin-left: 8px;
  padding: 1px 3px 0;
  border-radius: 50%;

  &:hover {
    font-weight: 700;
    cursor: pointer;
  }

  &:active {
    background-color: ${COLORS.BLUE2};
  }
`;

const ExpandAddKeyframe = keyframes`
  from {
    padding: 4px;
  }

  to {
    padding: 4px 8px;
  }
`;

export const AddTagWrapper = styled.form<{ open: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  color: white;
  background-color: ${COLORS.BLUE};
  border-radius: 1em;
  padding: 4px;
  ${props => (props.open && css`
    animation: ${ExpandAddKeyframe} 0.2s ease-out forwards;
  `)}
`;

const ExpandInputKeyframe = keyframes`
  from {
    width: 0px;
  }
  to {
    width: 96px;
  }
`;

export const AddTagInput = styled.input<{ open: boolean }>`
  display: ${props => !props.open && 'none'};
  background-color: ${COLORS.BLUE};
  color: white;
  border: none;
  outline: 0;
  ${props => (props.open && css`
    animation: ${ExpandInputKeyframe} 0.2s ease-out forwards;
  `)}
`;

export const TagAddIcon = styled(Icon) <{ open: boolean }>`
  display: ${props => props.open && 'none'};
  font-size: 10px;
  padding: 1px 3px 0;
  border-radius: 50%;

  &: hover {
    font-weight: 700;
    cursor: pointer;
  }

  &: active {
    background-color: ${ COLORS.BLUE2};
  }
`;

export const TagSubmitButton = styled.button<{ open: boolean }>`
  display: ${props => !props.open && 'none'};
  border: 0px;
  padding: 0;
  margin: 0;
  outline: none;
  background-color: ${COLORS.BLUE};
  color: ${COLORS.WHITE};
`;

export const TagSubmitIcon = styled(Icon)`
  font-size: 14px;
  padding: 1px 3px 0;
  border-radius: 50%;

  &: hover {
    font-weight: 700;
    cursor: pointer;
  }

  &: active {
    background-color: ${ COLORS.BLUE2};
  }
`;

