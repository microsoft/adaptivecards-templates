import React from 'react';

import { Template } from 'adaptive-templating-service-typescript-node';
import { getShareURL, isTemplateInstanceShareable } from '../../../utils/TemplateUtil/TemplateUtil';

import ShareModalForm from './ShareModalForm';

import ModalHOC from '../../../utils/ModalHOC';

import { closeModal } from '../../../store/page/actions';
import { updateTemplate } from '../../../store/currentTemplate/actions';
import { connect } from 'react-redux';
import { RootState } from '../../../store/rootReducer';

import { TextField, Toggle, TooltipHost } from 'office-ui-fabric-react';

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
import { DescriptionAccent } from '../PublishModal/styled';
import * as STRINGS from '../../../assets/strings';

interface ShareModalProps {
  template: Template;
  templateVersion: string;
  closeModal: () => void;
  redirectUri?: string;
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

const mapStateToProps = (state: RootState) => {
  return {
    redirectUri: state.auth.redirectUri,
  };
};

class ShareModal extends React.Component<ShareModalProps> {

  onChange = (event: React.MouseEvent, checked?: boolean) => {
    this.props.toggleShare(this.props.templateVersion, checked ? checked : false);
  }

  render() {
    let isTemplateShared = isTemplateInstanceShareable(this.props.template, this.props.templateVersion);
    return (
      <BackDrop>
        <Modal aria-label={STRINGS.SHARE_MODAL_TITLE}>
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
          <Description>
            {STRINGS.SHARE_MODAL_DESCRIPTION}
            <DescriptionAccent>
              {this.props.template.name} - {this.props.templateVersion}
            </DescriptionAccent>
          </Description>
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

export default ModalHOC(connect(mapStateToProps, mapDispatchToProps)(ShareModal));
