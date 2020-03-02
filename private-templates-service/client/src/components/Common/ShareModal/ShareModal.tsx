import React from 'react';
import { Template } from 'adaptive-templating-service-typescript-node';
import { BackDrop, Modal, Header, Description, CenterPanelWrapper, ShareLinkPanel, EmailPanel, LinkRow, StyledButton, TextFieldContainer } from './styled';
import { SemiBoldText } from '../PublishModal/styled';
import { TextField, Button } from 'office-ui-fabric-react';
import Config from '../../../Config';

interface ShareModalProps {
  template: Template;
  templateVersion?: string;
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
              <LinkRow>
                <TextFieldContainer>
                  <TextField readOnly={true}
                    prefix={Config.redirectUri}
                    defaultValue={"/preview/" + this.props.template.id + "/" + this.props.templateVersion}
                    width={100} />
                </TextFieldContainer>
                <Button iconProps={{ iconName: 'Copy' }} onClick={() => { }}>
                  Copy
                </Button>
              </LinkRow>
            </ShareLinkPanel>
            <EmailPanel>
              <SemiBoldText>Send to recipients</SemiBoldText>
              <TextField />
            </EmailPanel>
          </CenterPanelWrapper>
        </Modal>

      </BackDrop>

    );
  }
}

export default ShareModal;