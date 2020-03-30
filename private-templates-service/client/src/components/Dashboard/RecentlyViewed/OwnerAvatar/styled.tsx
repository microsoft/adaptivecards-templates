import styled from 'styled-components';
import { COLORS } from '../../../../globalStyles';

export const ProfilePic = styled.img`
  border-radius: 50%;
`

export const Container = styled.div`
  margin-bottom: 3px;
  `

export const InitialsPic = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 50%;
  background-color: ${COLORS.BLUE2};
  justify-content: center;
  align-items: center;
  `

export const Initials = styled.div`
  text-align: center;
  color: ${COLORS.WHITE};
`