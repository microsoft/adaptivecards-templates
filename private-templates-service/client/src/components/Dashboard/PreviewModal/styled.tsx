import styled from 'styled-components';

import { COLORS, BREAK } from '../../../globalStyles';

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 64px;
  bottom: 0;
  left: 260px;
  right: 0;
  background-color: ${COLORS.GREY1};
  z-index: 1;

  @media only screen and (max-width: ${BREAK.SM}px) {
    left: 0;
    top: 48px;
  }
`;

export const ModalWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 100%;
`;

export const ACPanel = styled.div`
  flex: 1 0 auto;
  display: flex;
  width: 50%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ACWrapper = styled.div`
  padding-bottom: 160px;
`;

export const DescriptorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  align-items: stretch;
  flex: 1 0 auto;
  background: ${COLORS.WHITE};
  border-left: 1px solid ${COLORS.BORDER};
`;
