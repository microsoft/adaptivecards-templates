import styled from "styled-components";
import { COLORS } from "../../globalStyles";
import { Card, RowWrapper, CardBody } from "./PreviewModal/TemplateInfo/styled";

// export const RecentlyViewedBody = styled(CardBody);

export const RecentlyViewedHeader = styled(RowWrapper)`
  font-size: 22px;
  font-weight: 600;
  border-bottom: 1px solid ${COLORS.BORDER};
  justify-content: space-around;
`;

export const RecentlyViewedContainer = styled(Card)`
  border-radius: 5px;
  border-style: solid;
  border-color: ${COLORS.BORDER2};
  border-width: 1px;
`;

export const Title = styled.h1`
  padding-top: 15px;
  font-size: 1.25rem;
`;

export const DashboardContainer = styled.div`
  margin: 0px 40px;
  //   border: 1px solid;
`;

export const OuterWindow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
`;
export const TagsContainer = styled.div`
  background-color: ${COLORS.GREY1};
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: flex-start;
  width: 300px;
  padding-left: 30px;
`;
// styled.input<{ open: boolean }>`
