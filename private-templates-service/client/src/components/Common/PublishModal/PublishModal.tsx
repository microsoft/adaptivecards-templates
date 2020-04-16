import React from 'react';
import { connect } from 'react-redux';

import { Template, PostedTemplate } from 'adaptive-templating-service-typescript-node';

// Redux
import { updateTemplate } from '../../../store/currentTemplate/actions';
import { ModalState } from '../../../store/page/types';
import { openModal, closeModal } from '../../../store/page/actions';

// Components
import AdaptiveCardPanel from '../../AdaptiveCardPanel';
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
  BottomRow,
  ButtonGroup,
  CancelButton,
  CardWrapper,
  PublishButton,
} from './styled';
import { PUBLISH_CANCEL, PUBLISH_BUTTON } from '../../../assets/strings';
import { getVersionNumber } from '../../../utils/TemplateUtil/TemplateUtil';

interface Props {
  template: Template;
  templateVersion: string;
  publishTemplate: (templateVersion: string) => void;
  openModal: (modalState: ModalState) => void;
  closeModal: () => void;
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    publishTemplate: (templateVersion: string) => {
      dispatch(updateTemplate(undefined, templateVersion, undefined, undefined, undefined, PostedTemplate.StateEnum.Live));
    },
    openModal: (modalState: ModalState) => {
      dispatch(openModal(modalState));
    },
    closeModal: () => {
      dispatch(closeModal());
    }
  }
}

class PublishModal extends React.Component<Props> {

  publish = () => {
    this.props.publishTemplate(this.props.templateVersion ? this.props.templateVersion : "1.0");
    this.props.openModal(ModalState.Share);
  }

  getNewTemplateVersion = (): string => {
    if (this.props.template && this.props.templateVersion) {
      return getVersionNumber(this.props.template, this.props.templateVersion);
    }
    return "1.0";
  }

  render() {
    const { template } = this.props;

    return (
      <BackDrop>
        <Modal aria-label={STRINGS.PUBLISH_CARD}>
          <Header>{STRINGS.PUBLISH_CARD}</Header>
          <Description>
            {STRINGS.PUBLISH_MODAL_DESC}
            <DescriptionAccent>{template.name + " - v" + this.getNewTemplateVersion()}</DescriptionAccent>
          </Description>
          <CenterPanelWrapper>
            <CardWrapper>
              <AdaptiveCardPanel template={template} version={this.props.templateVersion} />
            </CardWrapper>
          </CenterPanelWrapper>
          <BottomRow>
            <ButtonGroup>
              <CancelButton text={PUBLISH_CANCEL} onClick={this.props.closeModal} />
              <PublishButton text={PUBLISH_BUTTON} onClick={this.publish} />
            </ButtonGroup>
          </BottomRow>
        </Modal>
      </BackDrop>
    );
  }
}

export default ModalHOC(connect(() => { return {} }, mapDispatchToProps)(PublishModal));
