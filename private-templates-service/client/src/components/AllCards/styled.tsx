import styled from "styled-components";
import { OuterDashboardContainer, DashboardContainer} from "../Dashboard/styled";

export const PlaceholderText = styled.h5`
  font-family: Segoe UI Regular;
  padding-top: 20px;
`;

export const OuterAllCardsContainer = styled(OuterDashboardContainer)``;
export const AllCardsContainer = styled(DashboardContainer)``;
export const UpperBar = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
`;