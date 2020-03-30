import styled, { css, keyframes } from 'styled-components';
import { COLORS } from '../../../globalStyles';

import { Icon } from 'office-ui-fabric-react';

const DuplicateKeyFrame = keyframes`
  from {
    background-color: ${COLORS.BLUE};
  }

  to {
    background-color: ${COLORS.GREY2};
  }
`;

export const Tag = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  background-color: ${COLORS.GREY2};
  border-radius: 1em;
  margin: 0 16px 12px 0;
  padding: 4px 10px 4px 16px;
  
  &.duplicate {
    animation: ${DuplicateKeyFrame} 0.3s forwards;
  }
`;

export const TagText = styled.div``;

export const TagCloseIcon = styled(Icon)`
  font-size: 0.625rem;
  margin-left: 8px;
  padding: 1px 3px 0;
  border-radius: 50%;

  &:hover {
    font-weight: 700;
    cursor: pointer;
  }

  &:active {
    background-color: ${COLORS.BORDER2};
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
  background-color: ${COLORS.GREY2};
  border-radius: 1em;
  padding: 6.5px;
  margin-bottom: 12px;
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
  background-color: ${COLORS.GREY2};
  border: none;
  outline: 0;
  ${props => (props.open && css`
    animation: ${ExpandInputKeyframe} 0.2s ease-out forwards;
  `)}
`;

export const TagAddIcon = styled(Icon) <{ open: boolean }>`
  display: ${props => props.open && 'none'};
  align-self: center;
  font-size: 0.625rem;
  padding: 1px 3px 0;
  border-radius: 50%;

  &: hover {
    font-weight: 700;
    cursor: pointer;
  }

  &: active {
    background-color: ${ COLORS.BORDER2};
  }
`;

export const TagSubmitButton = styled.button<{ open: boolean }>`
  display: ${props => !props.open && 'none'};
  align-self: center;
  border: 0px;
  outline: 0px;
  padding: 0px;
  background-color: ${COLORS.GREY2};

  &: active {
    outline: 0px;
  }
`;

export const TagSubmitIcon = styled(Icon)`
  align-self: center;
  font-size: 0.875rem;
  padding: 1px 3px 0;
  border-radius: 50%;

  &: hover {
    font-weight: 700;
    cursor: pointer;
  }

  &: active {
    background-color: ${ COLORS.BORDER2};
  }
`;

