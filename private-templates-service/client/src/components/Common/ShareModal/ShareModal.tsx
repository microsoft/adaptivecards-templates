import React from 'react';

import { Template } from 'adaptive-templating-service-typescript-node';
import { getShareURL, isTemplateInstanceShareable } from '../../../utils/TemplateUtil/TemplateUtil';

import ShareModalForm from './ShareModalForm';

import ModalHOC from '../../../utils/ModalHOC';

import { closeModal } from '../../../store/page/actions';
import { connect } from 'react-redux';

import { TextField, Toggle, TooltipHost, Icon } from 'office-ui-fabric-react';

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
  CopyLinkButton,
  ToggleContainer,
  TopRowWrapper
} from './styled';
import * as STRINGS from '../../../assets/strings';
import { updateTemplate } from '../../../store/currentTemplate/actions';

interface ShareModalProps {
  template: Template;
  templateVersion: string;
  closeModal: () => void;
  toggleShare: (version: string, isShareable?: boolean) => void;
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    closeModal: () => {
      dispatch(closeModal());
    },
    toggleShare: (version: string, isShareable?: boolean) => {
      dispatch(updateTemplate(undefined, version, undefined, undefined, undefined, undefined, undefined, isShareable));
    }
  }
}

class ShareModal extends React.Component<ShareModalProps> {

  onChange = (event: React.MouseEvent, checked?: boolean) => {
    console.log("checked", checked);
    this.props.toggleShare(this.props.templateVersion, checked ? checked : false);
  }

  render() {
    let isTemplateShared = isTemplateInstanceShareable(this.props.template, this.props.templateVersion);
    console.log("isShared", isTemplateShared);
    return (
      <BackDrop>
        <Modal>
          <TopRowWrapper>
            <Header>{STRINGS.SHARE_MODAL_TITLE}</Header>
            <ToggleContainer>
              <TooltipHost content={isTemplateShared ? STRINGS.SHARING_ON_TOOLTIP : STRINGS.SHARING_OFF_TOOLTIP}>
                <Toggle
                  label={<div>{STRINGS.SHARING}{' '}</div>}
                  defaultChecked={isTemplateShared}
                  inlineLabel
                  onChange={this.onChange}
                />
              </TooltipHost>
            </ToggleContainer>
          </TopRowWrapper>
          <Description>{getShareModalDescription(this.props.template, this.props.templateVersion!)}</Description>
          <CenterPanelWrapper>
            <ShareLinkPanel>
              <SemiBoldText>{STRINGS.SHARE_WITH_LINK}</SemiBoldText>
              <LinkRow>
                <TextFieldContainer>
                  <TextField readOnly={true}
                    prefix={process.env.REACT_APP_ACMS_REDIRECT_URI}
                    defaultValue={getShareURL(this.props.template.id, this.props.templateVersion)}
                    width={100} />
                </TextFieldContainer>
                <CopyLinkButton iconProps={{ iconName: 'Copy' }} onClick={() => { onCopyURL(this.props) }}>
                  {STRINGS.COPY_LINK}
                </CopyLinkButton>
              </LinkRow>
            </ShareLinkPanel>
            <ShareModalForm shareURL={process.env.REACT_APP_ACMS_REDIRECT_URI + getShareURL(this.props.template.id, this.props.templateVersion)} templateVersion={this.props.templateVersion} />
          </CenterPanelWrapper>
        </Modal>
      </BackDrop>
    );
  }
}

function onCopyURL(props: ShareModalProps) {
  let copyCode = document.createElement('textarea');
  copyCode.innerText = process.env.REACT_APP_ACMS_REDIRECT_URI + getShareURL(props.template.id, props.templateVersion);
  document.body.appendChild(copyCode);
  copyCode.select();
  document.execCommand('copy');
  copyCode.remove();
}

function getShareModalDescription(template: Template, templateVersion: string): string {
  return STRINGS.SHARE_MODAL_DESCRIPTION + template!.name + " - " + templateVersion;
}

export default ModalHOC(connect(() => { return {} }, mapDispatchToProps)(ShareModal));
