import styled from "styled-components";
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';

import { COLORS, FONTS } from "../../globalStyles";

export const PlaceholderText = styled.h5`
  font-family: ${FONTS.SEGOE_UI_REGULAR};
  padding-top: 20px;
`;

export const Title = styled.h1`
  padding-top: 15px;
  font-size: 1.5rem;
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};
`;

export const OuterDashboardContainer = styled.div`
  display: contents;
  height: calc(100vh - 61px);
`;

export const DashboardContainer = styled.div`
  flex: 1;
  padding: 0px 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

export const OuterWindow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  height: auto;
  flex: 1;
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

export const CenteredSpinner = styled(Spinner)`
  margin: 120px auto;
`;