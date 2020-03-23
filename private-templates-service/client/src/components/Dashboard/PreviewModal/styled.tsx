import styled from 'styled-components';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';

import { COLORS } from '../../../globalStyles';

export const ModalWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 100%;
`;

export const ACOuterPanel = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  padding: 32px 48px 0 0;
`;

export const StyledDropdown = styled(Dropdown)`
  align-self: flex-end;
  min-width: 190px;
`;

export const ACPanel = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ACWrapper = styled.div`
  margin-bottom: 180px;
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
