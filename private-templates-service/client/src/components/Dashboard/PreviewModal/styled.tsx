import styled from 'styled-components';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';

import { COLORS } from '../../../globalStyles';

export const ModalWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 100%;
`;

export const ACPanel = styled.div`
  flex: 1 0 auto;
  display: flex;
  width: 55%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ACWrapper = styled.div`
  padding-bottom: 160px;
`;

export const DescriptorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
  align-items: stretch;
  flex: 1 0 auto;
  background: ${COLORS.WHITE};
  border-left: 1px solid ${COLORS.BORDER2};
`;

export const CenteredSpinner = styled(Spinner)`
  margin: auto;
`;
