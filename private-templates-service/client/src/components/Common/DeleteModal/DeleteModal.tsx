import React from 'react';
import { connect } from 'react-redux';

// Libraries
import { PrimaryButton } from 'office-ui-fabric-react';

import { Template } from 'adaptive-templating-service-typescript-node';

// Redux
import { deleteTemplateVersion } from '../../../store/currentTemplate/actions';
import { closeModal } from '../../../store/page/actions';

// Components
import AdaptiveCard from '../AdaptiveCard';
import ModalHOC from '../../../utils/ModalHOC';

// Strings
import * as STRINGS from '../../../assets/strings';

// Styles
import {
  CenterPanelWrapper,
  BottomRow,
} from '../../Common/UnpublishModal/styled';

import {
  Container,
} from '../../AdaptiveCardPanel/styled'

import {
  BackDrop,
  Modal,
  Header,
  Description,
  DescriptionAccent,
  ButtonGroup,
  CancelButton,
  CardWrapper,
} from '../../Common/PublishModal/styled';

interface Props {
  template: Template;
  templateVersion: string;
  deleteTemplate: (templateVersion: string) => void;
  closeModal: () => void;
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    deleteTemplate: (templateVersion: string) => {
      dispatch(deleteTemplateVersion(templateVersion));
    },
    closeModal: () => {
      dispatch(closeModal());
    }
  }
}

class DeleteModal extends React.Component<Props> {
  delete = () => {
    this.props.deleteTemplate(this.props.templateVersion);
    this.props.closeModal();
  }

  render() {
    const { template } = this.props;

    return (
      <BackDrop>
        <Modal aria-label={STRINGS.DELETE_TITLE}>
          <Header>{STRINGS.DELETE_TITLE}</Header>
          <div>{STRINGS.DELETE_CONFIRMATION}<DescriptionAccent>{template.name} - {this.props.templateVersion}</DescriptionAccent>?</div>
          <Description>{STRINGS.DELETE_WARNING}</Description>
          <CenterPanelWrapper>
            <Container>
              <CardWrapper>
                <AdaptiveCard cardtemplate={template} templateVersion={this.props.templateVersion} />
              </CardWrapper>
            </Container>
          </CenterPanelWrapper>
          <BottomRow>
            <ButtonGroup>
              <CancelButton text={STRINGS.CANCEL} onClick={this.props.closeModal} />
              <PrimaryButton text={STRINGS.DELETE} onClick={this.delete} />
            </ButtonGroup>
          </BottomRow>
        </Modal>
      </BackDrop>
    )
  }
}

export default ModalHOC(connect(() => { return {} }, mapDispatchToProps)(DeleteModal));
