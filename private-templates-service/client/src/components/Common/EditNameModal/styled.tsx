import styled from 'styled-components';

import { TextField } from 'office-ui-fabric-react/lib/TextField';

export const EditWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding-bottom: 24px;
`;

export const StyledInput = styled(TextField)``;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
`;
