import styled from "styled-components";
import { COLORS, FONTS } from "../../../../../globalStyles";
import { ActionButton, Icon } from "office-ui-fabric-react";
import { Card, CardBody, StatusIndicator } from "./../styled";
import { TemplateStateWrapper } from "../../../../AdaptiveCardPanel/styled";
import { VersionContainer } from "../../../../Common/VersionModal/styled";

export const VersionOuterCard = styled(Card)`
  overflow-y: hidden;
  margin-bottom: 0px;
`;
export const VersionCardBody = styled(CardBody)`
  overflow-y: hidden;
`;

export const CardManageButton = styled(ActionButton)`
  margin-right: 20px;
  color: ${COLORS.GREY3};
`;

export const CardTitle = styled.h2`
  font-size: 1.375rem;
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};
  margin-left: 40px;
`;

export const VersionCardHeader = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
`;

export const VersionCardRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  padding-top: 8px;
  padding-left: 16px;
  padding-bottom: 9px;
  padding-right: 16px;
`;

export const VersionCardRowHover = styled(VersionCardRow)`
  padding-left: 20px;
  &: hover {
    background-color: ${COLORS.GREYHOVER};
    cursor: pointer;
  }
`;

export const VersionCardRowTitle = styled.div`
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};
`;

export const VersionCardRowText = styled.div`
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};
`;

export const DateWrapper = styled.div`
  flex-basis: 25%;
`;

export const StatusWrapper = styled.div`
  flex-basis: 25%;
  display: flex;
  justify-content: flex-start;
`;

export const VersionWrapper = styled.div`
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};
  flex-basis: 15%;
`;

export const VersionIcon = styled(Icon)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  font-size: 1rem;
  color: ${COLORS.BLUE};
  padding: 6px 0 0 15px;
`;
export const InfoVersionContainer = styled(VersionContainer)`
  max-height: 150px;
`;

export const VersionElementsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const StatusIndicatorOverride = styled(StatusIndicator)`
  margin-left: 0px;
`;

export const StatusElementsContainer = styled(TemplateStateWrapper)`
  width: 100px;
  max-height: 7.5rem;
`;
