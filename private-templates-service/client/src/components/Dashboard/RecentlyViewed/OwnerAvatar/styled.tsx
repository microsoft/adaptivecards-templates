import styled from 'styled-components';
import { COLORS } from '../../../../globalStyles';

export const ProfilePic = styled.img`
  border-radius: 50%;
  height: 30px;
  width: 30px;
`

export const Container = styled.div`
  margin-right: 15px;
  `

export const InitialsPic = styled.div`
  border-radius: 50%;
  height: 30px;
  width: 30px;
  background-color: ${COLORS.BLUE2};
  justify-content: center;
  align-items: center;
  `

export const Initials = styled.div` 
    text-align: center;
    font-size: 15px;
    padding-top: 2.5px;
    color: ${COLORS.WHITE};
  `