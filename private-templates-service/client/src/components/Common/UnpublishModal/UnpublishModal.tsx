import React from 'react';
import { connect } from 'react-redux';

// Libraries
import { PrimaryButton } from 'office-ui-fabric-react'

import { Template, PostedTemplate } from 'adaptive-templating-service-typescript-node';

// Redux
import { updateTemplate } from '../../../store/currentTemplate/actions';
import { closeModal } from '../../../store/page/actions';

// Components
import AdaptiveCard from '../AdaptiveCard';

// Strings
import * as STRINGS from '../../../assets/strings';

// Styles
import {
  CenterPanelWrapper,
  BottomRow,
} from './styled';

import {
  Container,
  ACWrapper,
  TemplateName
} from '../../AdaptiveCardPanel/styled'

import {
  BackDrop,
  Modal,
  Header,
  Description,
  DescriptionAccent,
  ButtonGroup,
  CancelButton,
} from '../../Common/PublishModal/styled';


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
        <Modal>
          <Header>Unpublish Template</Header>
          <Description style={{ marginBottom: 0 }}>{STRINGS.UNPUBLISH_CONFIRMATION}<DescriptionAccent>{template.name} - {this.props.templateVersion}</DescriptionAccent>?</Description>
          <Description>{STRINGS.UNPUBLISH_WARNING}</Description>
          <CenterPanelWrapper>
            <Container>
              <ACWrapper>
                <AdaptiveCard cardtemplate={template} templateVersion={"1.0"} />
              </ACWrapper>
              <TemplateName>{template.name}</TemplateName>
            </Container>
          </CenterPanelWrapper>
          <BottomRow>
            <ButtonGroup>
              <CancelButton text="Cancel" onClick={this.props.closeModal} />
              <PrimaryButton text="Unpublish" onClick={this.unpublish} />
            </ButtonGroup>
          </BottomRow>
        </Modal>
      </BackDrop>
    );
  }
}

export default connect(() => { return {} }, mapDispatchToProps)(UnpublishModal);
