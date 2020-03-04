import styled from "styled-components";
import { COLORS } from "../../../globalStyles";
import { Card, RowWrapper, Title } from "../PreviewModal/TemplateInfo/styled";

export const RecentlyViewedBodyRow = styled.div`
  &: hover {
    background-color: #f3f3f3;
    cursor: pointer;
  }
  display: flex;
  flex-direction: row;
  flex: 1;
  padding-top: 20px;
  padding-bottom: 5px;
  padding-left: 97px; // WHY IS IT NOT THE SAMEEEEE
  justify-content: flex-start;
`;
export const RecentlyViewedHeaderItem = styled(Title)`
  padding-bottom: 20px;
  flex: 1;
`;
export const RecentlyViewedHeader = styled(RowWrapper)`
  flex: 1;
  padding-left: 100px;
  border-bottom: 1px solid ${COLORS.BORDER};
`;
export const RecentlyViewedContainer = styled(Card)`
  border-radius: 5px;
  border-style: solid;
  border-color: ${COLORS.BORDER2};
  border-width: 1px;
  display: flex;
  flex-direction: column;
`;

export const RecentlyViewedBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  // flex-wrap: wrap;
`;

export const RecentlyViewedItem = styled.h5`
  flex: 1;
`;
