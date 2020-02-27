import styled, { css, keyframes } from 'styled-components';
import { COLORS } from '../../../../globalStyles';

import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Icon } from 'office-ui-fabric-react';

export const OuterWrapper = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 16px 32px 16px 40px;
  border-bottom: 1px solid ${COLORS.BORDER2};
`;

export const TopRowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
`;

export const Title = styled.div`
  font-size: 22px;
  font-weight: 500;
`;

export const StatusIndicator = styled.div<{ isPublished?: boolean }>`
  background-color: ${props => props.isPublished ? COLORS.GREEN : COLORS.YELLOW};
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 0 4px 2px 8px;
`

export const Status = styled.div`
  font-size: 14px;
  font-weight: 400;
`
export const TimeStamp = styled.div`
  font-size: 14px;
  font-weight: 400;
`;

export const ActionsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-right: 20%;
`;

export const MainContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 32px 32px 0 40px;
`;

export const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
`;

export const Card = styled.div`
  flex: 0.47 0 auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 3px 6px #00000029;
  padding: 8px 0px 16px;
  margin-bottom: 24px;
`;

export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 8px;
  font-size: 22px;
  font-weight: 600;
  border-bottom: 1px solid ${COLORS.BORDER};
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  padding-top: 8px;
`;

export const IconWrapper = styled(Icon)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  font-size: 1.5rem;
  background-color: ${COLORS.GREY1};
  margin: 8px 0;
`;

export const UsageNumber = styled.div`
  font-size: 28px;
  font-weight: 600;
  height: 4rem;
  padding: 0.5rem;
  color: ${COLORS.BLUE};
`;

export const TagsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 16px 24px 0;
`;

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
    width: 64px;
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



export const TagSubmitIcon = styled(Icon) <{ open: boolean }>`
  display: ${props => !props.open && 'none'};
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
