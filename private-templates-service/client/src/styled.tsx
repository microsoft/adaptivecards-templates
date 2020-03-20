import styled from 'styled-components';

export const OuterAppWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

export const MainAppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow: auto;
`;

export const MainApp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: 1 1 auto;
  overflow: auto;
  max-height: 100vh;
`;
