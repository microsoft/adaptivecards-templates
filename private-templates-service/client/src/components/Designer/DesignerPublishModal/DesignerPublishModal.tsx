import React from 'react';

import ModalHOC from '../../../utils/ModalHOC';

import * as STRINGS from '../../../assets/strings';
import { BackDrop, Modal } from './styled';
import { ColumnWrapper, StyledTitle } from '../SaveModal/styled';
import { TitleWrapper } from '../../Dashboard/PreviewModal/TemplateInfo/styled';

const DesignerPublishModal = () => {
  return (
    <BackDrop>
      <Modal>
        <ColumnWrapper>
          <TitleWrapper>
            <StyledTitle>{STRINGS.PUBLISH_MODAL_TITLE}</StyledTitle>
            <div>{}</div>
          </TitleWrapper>
        </ColumnWrapper>
      </Modal>
    </BackDrop>
  );
}

export default ModalHOC(DesignerPublishModal);