import styled from 'styled-components';

export const OuterAppWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

export const MainAppWrapper = styled.div`
  display: block;
  overflow: auto;
  max-height: 100vh;
  width: 100%;
`;

export const MainApp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: auto;
  height: calc(100% - 61px);
`;
