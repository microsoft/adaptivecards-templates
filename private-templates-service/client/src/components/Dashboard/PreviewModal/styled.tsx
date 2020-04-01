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
  width: 55%;
  background: ${COLORS.GREY1};
`;

export const TooltipContainer = styled.div`
  width: fit-content;
  height: fit-content;
  align-self: flex-end;
`;

export const StyledDropdown = styled(Dropdown)`
  align-self: flex-end;
  min-width: 190px;
  margin: 32px 48px 0 0;
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
