import styled from 'styled-components';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';

import { COLORS } from '../../../globalStyles';

export const ModalWrapper = styled.main`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 100%;
`;

export const ACOuterPanel = styled.section`
  flex: 1 0 auto;
  display: flex;
  width: 55%;
  flex-direction: column;
  background: ${COLORS.GREY1};
  overflow: auto;
  margin-top: 5px;
`;

export const TooltipContainer = styled.div`
  width: fit-content;
  height: fit-content;
  align-self: flex-end;
`;

export const StyledDropdown = styled(Dropdown)`
  align-self: flex-end;
  min-width: 190px;
  max-width: 190px;
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

export const DescriptorWrapper = styled.section`
  display: flex;
  width: 45%;
  flex-direction: column;
  border-left: 1px solid ${COLORS.BORDER2};
  overflow: auto;
`;

export const CenteredSpinner = styled(Spinner)`
  margin: auto;
`;
