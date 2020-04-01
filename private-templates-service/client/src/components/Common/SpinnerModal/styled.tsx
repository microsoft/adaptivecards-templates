import styled from 'styled-components';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { COLORS } from '../../../globalStyles';

export const CenteredSpinner = styled(Spinner)`
  margin: auto;
`;

export const Dot = styled.div`
  height: 30px;
  width: 30px;
  background-color: ${COLORS.WHITE};
  border-radius: 50%;
  display: flex;
  justify-content: centre;
`;
