import styled from 'styled-components';
import { COLORS, FONTS } from '../../../../globalStyles';

import { Dropdown, IDropdownStyles } from "office-ui-fabric-react";
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { PostedTemplate } from 'adaptive-templating-service-typescript-node';

export const StyledVersionDropdown = styled(Dropdown)`
  display: flex
  padding-right: 10px;
`;

export const DropdownStyles: Partial<IDropdownStyles> = {
  dropdown: {
  },
  title: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
    borderWidth: 0,
    fontSize: 18,
    fontFamily: FONTS.SEGOE_UI_SEMI_BOLD,
    color: COLORS.BLACK
  },
}

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
  font-size: 1.375rem;
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};
`;

export const StatusIndicator = styled.div<{ state?: PostedTemplate.StateEnum }>`
  background-color: ${props =>
    props.state === PostedTemplate.StateEnum.Live ? COLORS.GREEN :
      props.state === PostedTemplate.StateEnum.Draft ? COLORS.YELLOW : COLORS.GREY3};
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 0 4px 2px 8px;
`

export const Status = styled.div`
  font-size: 0.875rem;
  padding-right: 7px;
`
export const TimeStamp = styled.div`
  font-size: 0.875rem;
  white-space: nowrap;
  margin-left: 64px;
`;

export const ActionsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const MainContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 8px 32px 0px 40px;
  overflow: hidden;
`;

export const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  margin-top: 20px;
  justify-content: space-between;
`;

export const Card = styled.section`
  flex: 0.32 0 0;
  display: flex;
  flex-direction: column;
  border: 1px solid ${COLORS.BORDER2};
  border-radius: 5px;
  padding: 8px 0px 16px;
  margin-bottom: 24px;
`;

export const CardHeader = styled.h2`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.375rem;
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};
  border-bottom: 1px solid ${COLORS.BORDER};
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.875rem;
  padding-top: 8px;
`;

export const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  font-size: 1.5rem;
  margin: 8px 0;
`;

export const UsageNumber = styled.div`
  font-size: 1.75rem;
  font-weight: bold;
  height: 4rem;
  padding: 0.5rem;
  color: ${COLORS.BLUE};
`;

export const TagsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 16px 24px 0;
`;

export const CenteredSpinner = styled(Spinner)`
  margin: auto;
`;
