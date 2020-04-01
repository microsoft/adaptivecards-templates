import styled from "styled-components";
import { COLORS } from "../../../globalStyles";
import { Card } from "../PreviewModal/TemplateInfo/styled";
import { StatusIndicator } from "../PreviewModal/TemplateInfo/styled";

export const RecentlyViewedBodyRow = styled.div`
  &: hover {
    background-color: ${COLORS.GREYHOVER};
    cursor: pointer;
  }
  display: flex;
  flex-direction: row;
  flex: 1;
  padding-left: 50px;
  padding-bottom: 2px;
  justify-content: flex-start;
`;

export const RecentlyViewedHeaderItem = styled.h5`
  flex: 1;
`;

export const RecentlyViewedHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-start;
  padding: 5px 0px 5px 50px;
  border-bottom: 1px solid ${COLORS.BORDER2};
`;

export const RecentlyViewedContainer = styled(Card)`
  flex: 0 1 auto;
  justify-content: flex-start;
  margin-top: 10px;
  padding-bottom: 0px;
`;

export const RecentlyViewedBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

export const RecentlyViewedItem = styled.div`
  font-family: Segoe UI Regular;
  flex: 1;
  padding-top: 6px;
`;

export const RecentlyViewedStatusIndicator = styled(StatusIndicator)`
  margin-right: 10px;
  margin-left: 0px;
`;

export const StatusWrapper = styled.div`
  padding-top: 3px;
`