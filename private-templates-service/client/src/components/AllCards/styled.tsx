import styled from "styled-components";
import { OuterDashboardContainer, DashboardContainer} from "../Dashboard/styled";
import { SearchAndFilter } from "../Dashboard/SearchPage/styled";

export const OuterAllCardsContainer = styled(OuterDashboardContainer)`
border-style: solid;
`;
export const AllCardsContainer = styled(DashboardContainer)`
overflow: hidden;
border-style: solid;
`;
export const UpperBar = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
`;

export const TagsContainer = styled.div`
onWhee
border-style:solid;
padding-top: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  overflow-x: hidden;
  overflow-y: hidden;
//   ::-webkit-scrollbar: {display:none};
`;

export const ViewHelperBar = styled(SearchAndFilter)``;
export const ViewToggleBar = styled.div`
    display:flex;
    flex-direction: row;
    justify-content: space-evenly;
`