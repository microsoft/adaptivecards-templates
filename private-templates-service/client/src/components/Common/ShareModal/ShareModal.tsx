import React from 'react';
import { Template } from 'adaptive-templating-service-typescript-node';
import { BackDrop, Modal, Header, Description, CenterPanelWrapper, ShareLinkPanel, EmailPanel } from './styled';
import { SemiBoldText } from '../PublishModal/styled';
import { TextField } from 'office-ui-fabric-react';
import Config from '../../../Config';

interface ShareModalProps {
  template: Template;
  version: string;
}

class ShareModal extends React.Component<ShareModalProps> {

  render() {
    return (
      <BackDrop>
        <Modal>
          <Header>Share template version</Header>
          <Description>You will be sharing your template below. Shared users can only view your template.</Description>
          <CenterPanelWrapper>
            <ShareLinkPanel>
              <SemiBoldText>Share with link</SemiBoldText>
              <TextField readOnly={true} prefix={Config.redirectUri}>{"/preview/" + this.props.template.id + "/" + this.props.version}</TextField>
            </ShareLinkPanel>
            <EmailPanel>
              <SemiBoldText>Send to recipients</SemiBoldText>
            </EmailPanel>
          </CenterPanelWrapper>
        </Modal>

      </BackDrop>

    );
  }
}

export default ShareModal;