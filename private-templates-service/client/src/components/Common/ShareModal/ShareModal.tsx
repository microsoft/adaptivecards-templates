import React from 'react';

import { Template } from 'adaptive-templating-service-typescript-node';
import { getShareURL } from '../../../utils/TemplateUtil/TemplateUtil';

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
import { RootState } from '../../../store/rootReducer';

interface ShareModalProps {
  template: Template;
  templateVersion?: string;
  closeModal: () => void;
  redirectUri?: string;
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    closeModal: () => {
      dispatch(closeModal());
    }
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    redirectUri: state.auth.redirectUri,
  };
};

class ShareModal extends React.Component<ShareModalProps> {

  render() {
    return (
      <BackDrop>
        <Modal aria-label={STRINGS.SHARE_MODAL_TITLE}>
          <Header>{STRINGS.SHARE_MODAL_TITLE}</Header>
          <Description>{STRINGS.SHARE_MODAL_DESCRIPTION}{getShareModalDescription(this.props.template, this.props.templateVersion!)}</Description>
          <CenterPanelWrapper>
            <ShareLinkPanel>
              <SemiBoldText>{STRINGS.SHARE_WITH_LINK}</SemiBoldText>
              <LinkRow>
                <TextFieldContainer>
                  <TextField readOnly={true}
                    prefix={this.props.redirectUri!}
                    defaultValue={getShareURL(this.props.template.id, this.props.templateVersion)}
                    width={100} />
                </TextFieldContainer>
                <CopyLinkButton iconProps={{ iconName: 'Copy' }} onClick={() => { onCopyURL(this.props) }}>
                  {STRINGS.COPY_LINK}
                </CopyLinkButton>
              </LinkRow>
            </ShareLinkPanel>
            <ShareModalForm shareURL={this.props.redirectUri! + getShareURL(this.props.template.id, this.props.templateVersion)} templateVersion={this.props.templateVersion} />
          </CenterPanelWrapper>
        </Modal>
      </BackDrop>
    );
  }
}

function onCopyURL(props: ShareModalProps) {
  let copyCode = document.createElement('textarea');
  copyCode.innerText = props.redirectUri + getShareURL(props.template.id, props.templateVersion);
  document.body.appendChild(copyCode);
  copyCode.select();
  document.execCommand('copy');
  copyCode.remove();
}

function getShareModalDescription(template: Template, templateVersion: string): string {
  return " " + template!.name + " - " + templateVersion;
}

export default ModalHOC(connect(mapStateToProps, mapDispatchToProps)(ShareModal));
