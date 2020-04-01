import React from 'react';
import { connect } from 'react-redux';

// Libraries
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from 'office-ui-fabric-react';
import { SearchBox } from 'office-ui-fabric-react';

import { Template, PostedTemplate } from 'adaptive-templating-service-typescript-node';

// Redux
import { updateTemplate } from '../../../store/currentTemplate/actions';
import { closeModal } from '../../../store/page/actions';

// Components
import AdaptiveCard from '../AdaptiveCard';
import ModalHOC from '../../../utils/ModalHOC';

// Strings
import * as STRINGS from '../../../assets/strings';

// Styles
import {
  BackDrop,
  Modal,
  Header,
  Description,
  DescriptionAccent,
  CenterPanelWrapper,
  CenterPanelLeft,
  AdaptiveCardPanel,
  CenterPanelRight,
  SemiBoldText,
  BottomRow,
  NotifiedGroup,
  ButtonGroup,
  CancelButton,
  EmailPanel,
  SendMailButton,
} from './styled';





import { UserType } from '../../../store/auth/types';
import Config from '../../../Config';
import { RootState } from '../../../store/rootReducer';


interface Props {
  template?: Template;
  templateVersion: string;
  publishTemplate: (templateVersion: string) => void;
  shareTemplate: (templateVersion: string) => void;
  saveTemplate: (templateID?: string, currentVersion?: string, templateJSON?: object, sampleDataJSON?: object, templateName?: string) => void;
  closeModal: () => void;
  user?: UserType;
  pageTitle?: string;
  designerTemplateJSON?: object;
  designerSampleDataJSON?: object;
}

const mapStateToProps = (state: RootState) => {
  return {
    user: state.auth.user,
    pageTitle: state.page.currentPage
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    publishTemplate: (templateVersion: string) => {
      dispatch(updateTemplate(undefined, templateVersion, undefined, undefined, undefined, PostedTemplate.StateEnum.Live));
    },
    shareTemplate: (templateVersion: string) => {
      dispatch(updateTemplate(undefined, templateVersion, undefined, undefined, undefined, undefined, undefined, true));
    },
    saveTemplate: (templateID?: string, currentVersion?: string, templateJSON?: object, sampleDataJSON?: object, templateName?: string) => {
      dispatch(updateTemplate(templateID, currentVersion, templateJSON, sampleDataJSON, templateName));
    },
    closeModal: () => {
      dispatch(closeModal());
    }
  }
}

class PublishModal extends React.Component<Props> {

  publish = () => {
    if (this.props.pageTitle && this.props.pageTitle.toLowerCase() === "designer") {
      this.props.saveTemplate(this.props.template ? this.props.template.id : undefined, this.props.templateVersion, this.props.designerTemplateJSON, this.props.designerSampleDataJSON, "");
    }
    this.props.publishTemplate(this.props.templateVersion ? this.props.templateVersion : "1.0");
    this.props.closeModal();
  }

  editName = () => {
    return (
      <TextField label={STRINGS.CARDNAME} defaultValue={this.props.template ? this.props.template.name : STRINGS.UNTITLEDCARD} />
    );
  }

  onSendEmail = () => {
    this.props.shareTemplate(this.props.templateVersion);
  }

  initMailingLink = (props: Props): string => {
    let templateName = props.template!.name;

    const to = "";
    const subject = "ACMS: " + props.user!.displayName + " published and shared " + templateName + " with you";
    const body = "Here is the link to access this Adaptive Card: " + this.shareURL(props);

    let mailingLink = "mailto:" + to + "?subject=" + subject + "&body=" + body;

    return mailingLink.replace(" ", "%20");
  }

  shareURL = (props: Props): string => {
    return Config.redirectUri + "/preview/" + props.template.id + "/" + props.templateVersion;
  }

  render() {
    const { template, templateVersion } = this.props;

    return (
      <BackDrop>
        <Modal>
          <Header>{STRINGS.PUBLISH_MODAL_TITLE}</Header>
          <Description>{STRINGS.PUBLISH_MODAL_DESP}<DescriptionAccent>{template.name + " - v" + templateVersion}</DescriptionAccent></Description>
          <CenterPanelWrapper>
            <CenterPanelLeft>
              <AdaptiveCardPanel>
                <AdaptiveCard cardtemplate={template} templateVersion={this.props.templateVersion} />
              </AdaptiveCardPanel>
            </CenterPanelLeft>
            <CenterPanelRight>
              {!(template && template.id && template.id !== "") && <TextField label={STRINGS.CARDNAME} defaultValue={this.props.template.name} />}
              <EmailPanel>
                <SemiBoldText>{STRINGS.EMAIL_RECIPIENTS}</SemiBoldText>
                <SendMailButton text={STRINGS.SEND_IN_OUTLOOK} href={this.initMailingLink(this.props)} onClick={this.onSendEmail} />
              </EmailPanel>
            </CenterPanelRight>
          </CenterPanelWrapper>
          <BottomRow>
            <ButtonGroup>
              <CancelButton text="Cancel" onClick={this.props.closeModal} />
              <PrimaryButton text="Publish" onClick={this.publish} />
            </ButtonGroup>
          </BottomRow>
        </Modal>
      </BackDrop>
    );
  }
}

export default ModalHOC(connect(mapStateToProps, mapDispatchToProps)(PublishModal));
