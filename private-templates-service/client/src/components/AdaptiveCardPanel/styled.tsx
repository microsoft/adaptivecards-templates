import styled from "styled-components";
import { COLORS, FONTS } from "../../globalStyles";

export const Container = styled.div`
  flex: 1 1 0px;
  display: flex;
  flex-direction: column;
  background: white;
  height: 220px;
  min-width: 300px;
  max-width: 350px;
  border: 1px solid ${COLORS.BORDER2};
  border-radius: 5px;
  cursor: pointer;
  margin: 0 24px 24px 0;
  @media only screen and (max-width: 1399px) {
    margin-bottom: 20px;
  }
  &: hover {
    background: ${COLORS.GREYHOVER};
  }
`;

export const ACWrapper = styled.div`
  flex: 4;
  overflow: hidden;
`;

export const TemplateFooterWrapper = styled.div`
  padding: 10px 0px 10px 20px;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  border-top: 1px solid ${COLORS.BORDER2};
`;

export const TemplateStateWrapper = styled.div`
  flex: 0.8;
  display: flex;
  flex-direction: row;
  align-items: baseline;
`;

export const TemplateNameAndDateWrapper = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: baseline;
`;
export const TemplateName = styled.div`
  font-size: 0.95rem;
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};
  color: black;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 196px;
  overflow: hidden;
`;
export const TemplateUpdatedAt = styled.div`
  font-family: ${FONTS.SEGOE_UI_REGULAR};
  font-size: 0.8rem;
  color: ${COLORS.GREY3};
`;

export const Bottom = styled.div`
  padding: 20px;
`;

export const Align = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 5px;
`;
