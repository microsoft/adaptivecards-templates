import React from 'react';

import { Template } from 'adaptive-templating-service-typescript-node';

import ShareModalForm from './ShareModalForm';

import ModalHOC from '../../../utils/ModalHOC';

import { closeModal } from '../../../store/page/actions';
import { connect } from 'react-redux';

import { TextField } from 'office-ui-fabric-react';

import {
  BackDrop,
  Modal,
  Header,
  Description,
  CenterPanelWrapper,
  ShareLinkPanel,
  SemiBoldText,
  LinkRow,
  TextFieldContainer,
  CopyLinkButton
} from './styled';
import * as STRINGS from '../../../assets/strings';


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
          <Header>{STRINGS.SHARE_MODAL_TITLE}</Header>
          <Description>{getShareModalDescription(this.props.template, this.props.templateVersion!)}</Description>
          <CenterPanelWrapper>
            <ShareLinkPanel>
              <SemiBoldText>{STRINGS.SHARE_WITH_LINK}</SemiBoldText>
              <LinkRow>
                <TextFieldContainer>
                  <TextField readOnly={true}
                    prefix={process.env.REACT_APP_ACMS_REDIRECT_URI}
                    defaultValue={getShareURL(this.props)}
                    width={100} />
                </TextFieldContainer>
                <CopyLinkButton iconProps={{ iconName: 'Copy' }} onClick={() => { onCopyURL(this.props) }}>
                  {STRINGS.COPY_LINK}
                </CopyLinkButton>
              </LinkRow>
            </ShareLinkPanel>
            <ShareModalForm shareURL={process.env.REACT_APP_ACMS_REDIRECT_URI + getShareURL(this.props)} templateVersion={this.props.templateVersion} />
          </CenterPanelWrapper>
        </Modal>

      </BackDrop>

    );
  }
}

function onCopyURL(props: ShareModalProps) {
  let copyCode = document.createElement('textarea');
  copyCode.innerText = process.env.REACT_APP_ACMS_REDIRECT_URI + getShareURL(props);
  document.body.appendChild(copyCode);
  copyCode.select();
  document.execCommand('copy');
  copyCode.remove();
}

function getShareURL(props: ShareModalProps): string {
  return "/preview/" + props.template.id + "/" + props.templateVersion;
}

function getShareModalDescription(template: Template, templateVersion: string): string {
  return STRINGS.SHARE_MODAL_DESCRIPTION + template!.name + " - " + templateVersion;
}

export default ModalHOC(connect(() => { return {} }, mapDispatchToProps)(ShareModal));
