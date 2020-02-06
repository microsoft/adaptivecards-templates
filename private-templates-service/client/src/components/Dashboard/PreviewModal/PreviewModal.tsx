import React from 'react';
import { ModalBackdrop, ModalWrapper, ACPanel, ACWrapper, DescriptorWrapper } from './styled';
import AdaptiveCard from '../../Common/AdaptiveCard'


interface Props {
  show: boolean;
  toggleModal: () => void;
}

class PreviewModal extends React.Component<Props, {}> {

  render() {
    return this.props.show ? (
      <ModalBackdrop>
        <ModalWrapper>
          <ACPanel>
            <ACWrapper>
              <AdaptiveCard />
            </ACWrapper>
          </ACPanel>
          <DescriptorWrapper>
            <span onClick={this.props.toggleModal}>close modal</span>
          </DescriptorWrapper>
        </ModalWrapper>
      </ModalBackdrop>
    ) : null;
  }
}

export default PreviewModal;
