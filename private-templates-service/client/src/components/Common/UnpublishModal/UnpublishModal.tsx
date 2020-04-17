import React from 'react';

import { Template, PostedTemplate } from 'adaptive-templating-service-typescript-node';

// Redux
import { connect } from 'react-redux';
import { updateTemplate } from '../../../store/currentTemplate/actions';
import { closeModal } from '../../../store/page/actions';

// Components
import AdaptiveCardPanel from '../../AdaptiveCardPanel';
import ModalHOC from '../../../utils/ModalHOC';

// Strings
import * as STRINGS from '../../../assets/strings';

// Styles
import {
  CenterPanelWrapper,
  BottomRow,
} from './styled';

import {
  BackDrop,
  Modal,
  Header,
  Description,
  DescriptionAccent,
  ButtonGroup,
  CancelButton,
  PublishButton,
} from '../../Common/PublishModal/styled';
import { UNPUBLISH_BUTTON, CANCEL_BUTTON } from '../../../assets/strings';

interface Props {
  template: Template;
  templateVersion: string;
  unpublishTemplate: (templateVersion: string) => void;
  closeModal: () => void;
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    unpublishTemplate: (templateVersion: string) => {
      dispatch(updateTemplate(undefined, templateVersion, undefined, undefined, undefined, PostedTemplate.StateEnum.Deprecated));
    },
    closeModal: () => {
      dispatch(closeModal());
    }
  }
}

class UnpublishModal extends React.Component<Props> {

  unpublish = () => {
    this.props.unpublishTemplate(this.props.templateVersion);
    this.props.closeModal();
  }

  render() {
    const { template } = this.props;

    return (
      <BackDrop>
        <Modal aria-label={STRINGS.UNPUBLISH_CARD}>
          <Header>{STRINGS.UNPUBLISH_CARD}</Header>
          <Description style={{ marginBottom: 0 }}>
            <DescriptionAccent>{template.name} - {this.props.templateVersion}</DescriptionAccent>
            {STRINGS.UNPUBLISH_CARD_DESC}
          </Description>
          <CenterPanelWrapper>
            <AdaptiveCardPanel template={template} />
          </CenterPanelWrapper>
          <BottomRow>
            <ButtonGroup>
              <CancelButton text={CANCEL_BUTTON} onClick={this.props.closeModal} />
              <PublishButton text={UNPUBLISH_BUTTON} onClick={this.unpublish} />
            </ButtonGroup>
          </BottomRow>
        </Modal>
      </BackDrop>
    );
  }
}

export default ModalHOC(connect(() => { return {} }, mapDispatchToProps)(UnpublishModal));
