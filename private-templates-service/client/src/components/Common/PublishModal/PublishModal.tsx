import React from 'react';
import { connect } from 'react-redux';

import { Template, PostedTemplate } from 'adaptive-templating-service-typescript-node';

// Redux
import { updateTemplate } from '../../../store/currentTemplate/actions';
import { closeModal } from '../../../store/page/actions';

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
  PublishButton,
} from './styled';


interface Props {
  template: Template;
  templateVersion: string;
  publishTemplate: (templateVersion: string) => void;
  closeModal: () => void;
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    publishTemplate: (templateVersion: string) => {
      dispatch(updateTemplate(undefined, templateVersion, undefined, undefined, undefined, PostedTemplate.StateEnum.Live));
    },
    closeModal: () => {
      dispatch(closeModal());
    }
  }
}

class PublishModal extends React.Component<Props> {

  publish = () => {
    this.props.publishTemplate(this.props.templateVersion ? this.props.templateVersion : "1.0");
    this.props.closeModal();
  }

  render() {
    const { template, templateVersion } = this.props;

    return (
      <BackDrop>
        <Modal>
          <Header>{STRINGS.PUBLISH_CARD}</Header>
          <Description>
            {STRINGS.PUBLISH_MODAL_DESC}
            <DescriptionAccent>{template.name + " - v" + templateVersion}</DescriptionAccent>
          </Description>
          <CenterPanelWrapper>
            <AdaptiveCardPanel template={template} version={this.props.templateVersion} />
          </CenterPanelWrapper>
          <BottomRow>
            <ButtonGroup>
              <CancelButton text="Cancel" onClick={this.props.closeModal} />
              <PublishButton text="Publish" onClick={this.publish} />
            </ButtonGroup>
          </BottomRow>
        </Modal>
      </BackDrop>
    );
  }
}

export default ModalHOC(connect(() => { return {} }, mapDispatchToProps)(PublishModal));
