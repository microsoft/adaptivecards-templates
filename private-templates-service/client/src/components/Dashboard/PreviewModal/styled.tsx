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
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ACWrapper = styled.div`
  padding-bottom: 160px;
  max-width: 100%;
`;

export const DescriptorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: 0.1 0 auto;
  background: ${COLORS.WHITE};
  border-left: 1px solid ${COLORS.BORDER2};
`;

export const CenteredSpinner = styled(Spinner)`
  margin: auto;
`;
