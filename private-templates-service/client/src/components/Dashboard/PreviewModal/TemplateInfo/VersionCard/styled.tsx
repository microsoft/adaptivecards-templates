import styled from 'styled-components';
import { COLORS, FONTS } from '../../../../../globalStyles';
import { ActionButton, Icon } from 'office-ui-fabric-react';
import {
  VersionContainer
} from '../../../../Common/VersionModal/styled';

import {
  Card,
  CardBody
} from './../styled';

export const VersionOuterCard = styled(Card)`
  overflow-y: hidden;
`
export const VersionCardBody = styled(CardBody)`
  overflow-y: hidden;
`

export const CardManageButton = styled(ActionButton)`
  color: ${COLORS.GREY3};
`

export const CardTitle = styled.h2`
  font-size: 1.375rem;
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};
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
  padding-top: 8px;
  padding-left: 16px;
  padding-bottom: 8px;
  padding-right: 16px;
  align-items: center;

  &: hover {
    background-color: ${COLORS.GREYHOVER};
    cursor: pointer;
  }
`
export const VersionCardRowTitle = styled.div`
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};
`

export const VersionCardRowText = styled.div`
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};
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
  font-family: ${FONTS.SEGOE_UI_SEMI_BOLD};
  align-items: center;
  flex-basis: 15%;
`

export const InfoVersionContainer = styled(VersionContainer)`
  max-height: 150px;
`