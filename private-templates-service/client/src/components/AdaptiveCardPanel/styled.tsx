import styled from "styled-components";
import { COLORS } from "../../globalStyles";

export const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 0 24px 24px 0;

  background: white;
  height: 200px;
  max-width: 350px;

  // -webkit-box-shadow: 0px 2px 6px 0px rgba(111, 111, 111, 0.4);
  // -moz-box-shadow: 0px 2px 6px 0px rgba(111, 111, 111, 0.4);
  // box-shadow: 0px 2px 6px 0px rgba(111, 111, 111, 0.4);

  border-radius: 5px;
  border-style: solid;
  border-color: ${COLORS.BORDER2};
  border-width: 1px;

  @media only screen and (max-width: 1399px) {
    margin-bottom: 20px;
  }
`;

export const ACWrapper = styled.div`
  flex: 4;
  overflow: hidden;
`;

export const TemplateFooterWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  border-top-style: solid;
  border-top-color: ${COLORS.BORDER2};
  border-width: 1px;
`;

export const TemplateStateWrapper = styled.div`
  flex: 0.8;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: baseline;
`;

export const TemplateNameAndDateWrapper = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;
export const TemplateName = styled.div`
  padding: 10px 0px 0px 20px;
  font-size: 0.95rem;
  font-family: Segoe UI Semibold;
  color: black;
`;
export const TemplateUpdatedAt = styled.div`
  font-family: Segoe UI Regular;
  font-size: 0.8rem;
  padding: 0px 0 10px 20px;
  color: grey;
`;

export const Bottom = styled.div`
  padding: 20px;
`;
