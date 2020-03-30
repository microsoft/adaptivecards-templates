import styled from 'styled-components';
import { COLORS } from '../../../../../globalStyles';
import { ActionButton, Icon } from 'office-ui-fabric-react';

export const CardManageButton = styled(ActionButton)`
  color: ${COLORS.GREY3};
  font-weight: 500;
`

export const CardTitle = styled.div`
  font-size: 1.375rem;
  font-weight: 600;
`

export const VersionCardHeader = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
`

export const VersionCardRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin-top: 8px;
  margin-left: 16px;
  margin-bottom: 8px;
  margin-right: 16px;
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
  align-items: center;
`

export const VersionIcon = styled(Icon)`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
height: 1rem;
width: 1rem;
border-radius: 50%;
font-size: 1.0rem;
color: ${COLORS.BLUE};
margin: 0 0 0 15px;
`

export const VersionWrapper = styled.div`
  display: flex;
  font-weight: 600;
  align-items: center;
  flex-basis: 15%;
`
