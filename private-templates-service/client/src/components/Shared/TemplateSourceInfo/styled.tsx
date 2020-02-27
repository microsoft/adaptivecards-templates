import styled from 'styled-components';
import { COLORS } from '../../../globalStyles';

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 16px 32px 16px 32px;
  border-bottom: 1px solid ${COLORS.BORDER2};
`;

export const TopRowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
`;

export const Title = styled.div`
  font-size: 22px;
  font-weight: 500;
`;

export const TemplateSourceWrapper = styled.div`
  background-color: ${COLORS.GREY2};
  width: 100%;
  height: 100vh;
  position: relative;
  overflow-wrap: break-word;
`;

export const SourceWrapper = styled.div`
  padding: 32px;
`;

export const Source = styled.div`
  font-family: "Courier New", Courier, monospace;
  font-size: 14px;
  font-weight: normal;
  white-space: pre-wrap;
`;