import styled from "styled-components";
import { OuterDashboardContainer, DashboardContainer } from "../Dashboard/styled";
import { SearchAndFilter } from "../Dashboard/SearchPage/styled";

export const OuterAllCardsContainer = styled(OuterDashboardContainer)`
  border-style: solid;
`;
export const AllCardsContainer = styled(DashboardContainer)`
  overflow: auto;
  border-style: solid;
`;
export const UpperBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

export const ViewHelperBar = styled(SearchAndFilter)``;

export const ViewToggleBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;
