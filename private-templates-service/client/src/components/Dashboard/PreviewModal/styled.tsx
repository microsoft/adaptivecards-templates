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
  width: 55%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${COLORS.GREY1};
`;

export const ACWrapper = styled.div`
  padding-bottom: 160px;
  max-width: 90%;
`;

export const DescriptorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: 1 0 auto;
  width: 45%;
  background: ${COLORS.WHITE};
  border-left: 1px solid ${COLORS.BORDER2};
`;

export const CenteredSpinner = styled(Spinner)`
  margin: auto;
`;
