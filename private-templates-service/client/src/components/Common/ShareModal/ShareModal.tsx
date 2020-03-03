import React from 'react';
import { Template } from 'adaptive-templating-service-typescript-node';
import { BackDrop, Modal, Header, Description, CenterPanelWrapper, ShareLinkPanel, EmailPanel, LinkRow, StyledButton, TextFieldContainer, BottomRow, ButtonGroup, CancelButton } from './styled';
import { SemiBoldText } from '../PublishModal/styled';
import { TextField, Button, NormalPeoplePicker, PrimaryButton } from 'office-ui-fabric-react';
import Config from '../../../Config';
import { closeModal } from '../../../store/page/actions';
import { connect } from 'react-redux';
import ShareModalForm from './ShareModalForm/ShareModalForm';

interface ShareModalProps {
  template: Template;
  templateVersion?: string;
  closeModal: () => void;
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    closeModal: () => {
      dispatch(closeModal());
    }
  }
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
                <Button iconProps={{ iconName: 'Copy' }} onClick={() => { onCopy(this.props) }}>
                  Copy
                </Button>
              </LinkRow>
            </ShareLinkPanel>
            <ShareModalForm />
          </CenterPanelWrapper>
        </Modal>

      </BackDrop>

    );
  }
}

function onCopy(props: ShareModalProps) {
  let copyCode = document.createElement('textarea');
  copyCode.innerText = Config.redirectUri + "/preview/" +
    props.template.id + "/" + props.templateVersion;
  document.body.appendChild(copyCode);
  copyCode.select();
  document.execCommand('copy');
  copyCode.remove();
}

function onShare(props: ShareModalProps, element: HTMLElement | null) {
  if (element) {
    alert();
  }
}
export default connect(undefined, mapDispatchToProps)(ShareModal);