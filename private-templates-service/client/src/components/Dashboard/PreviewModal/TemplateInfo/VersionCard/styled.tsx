import styled from 'styled-components';
import { COLORS } from '../../../../../globalStyles';
import { ActionButton } from 'office-ui-fabric-react';

export const CardManageButton = styled(ActionButton)`
  color: ${COLORS.GREY3};
  font-weight: 500;
`

export const CardTitle = styled.div`
  font-size: 22px;
  font-weight: 600;
`

export const VersionCardHeader = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`

export const VersionCardRow = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 8px;
  margin-bottom: 8px;
  align-items: center;
`

export const VersionCardRowTitle = styled.div`
  font-weight: 600;
`

export const VersionCardRowText = styled.div`
  font-weight: 600;
  align-items: center;
`

export const DateWrapper = styled.div`
  display: flex;
  flex-basis: 25%
`

export const StatusWrapper = styled.div`
  display: flex;
  flex-basis: 20%;
  flex-direction: row;
  align-items: center;
`