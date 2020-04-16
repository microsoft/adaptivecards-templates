import styled from "styled-components";
import { OuterDashboardContainer, DashboardContainer } from "../../Dashboard/styled";
import { SearchAndFilter } from "../../Dashboard/SearchPage/styled";

export const OuterCardsContainer = styled(OuterDashboardContainer)``;
export const InnerCardsContainer = styled(DashboardContainer)`
  overflow: auto;
`;
export const UpperBar = styled.section`
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
