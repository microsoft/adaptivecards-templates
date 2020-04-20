import styled from "styled-components";
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';

import { COLORS, FONTS } from "../../globalStyles";

export const Title = styled.h2`
  padding-top: 15px;
  font-size: 1.5rem;
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};
`;

export const OuterDashboardContainer = styled.main`
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

export const RecentlyEditedSection = styled.section<{ isPlaceholder: boolean }>`
  ${props => props.isPlaceholder && `
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
  `}
`;

export const OuterWindow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  height: auto;
  flex: 1;
`;
export const TagsContainer = styled.section`
  background-color: ${COLORS.GREY1};
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: flex-start;
  width: 300px;
  padding-left: 30px;
  margin-top:5px;
`;

export const CenteredSpinner = styled(Spinner)`
  margin: 120px auto;
`;
