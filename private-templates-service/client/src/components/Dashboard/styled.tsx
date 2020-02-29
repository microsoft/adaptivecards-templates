import styled from "styled-components";
import { COLORS } from "../../globalStyles";

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
