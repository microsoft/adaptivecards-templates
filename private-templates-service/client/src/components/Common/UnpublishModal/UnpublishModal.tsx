import React from 'react';
import { connect } from 'react-redux';

// Libraries
import { PrimaryButton } from 'office-ui-fabric-react'

import { Template, PostedTemplate } from 'adaptive-templating-service-typescript-node';

// Redux
import { updateTemplate } from '../../../store/currentTemplate/actions';

// Components
import AdaptiveCard from '../AdaptiveCard';

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
  toggleModal: () => void;
  unpublishTemplate: (templateVersion: string) => void;
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    unpublishTemplate: (templateVersion: string) => {
      dispatch(updateTemplate(undefined, templateVersion, undefined, undefined, undefined, PostedTemplate.StateEnum.Deprecated));
    }
  }
}

class UnpublishModal extends React.Component<Props> {

  unpublish = () => {
    this.props.unpublishTemplate(this.props.templateVersion);
    this.props.toggleModal();
  }

  render() {
    const { template } = this.props;

    return (
      <BackDrop>
        <Modal>
          <Header>Unpublish Template</Header>
    <Description style={{marginBottom: 0}}>Are you sure you want to unpublish <DescriptionAccent>{template.name} - {this.props.templateVersion}</DescriptionAccent>?</Description>
          <Description>Once a template is unpublished, your organization will not be able to use it.</Description>
          <CenterPanelWrapper>
            <Container>
              <ACWrapper>
                <AdaptiveCard cardtemplate={template} templateVersion={"1.0"}/>
              </ACWrapper>
              <TemplateName>{template.name}</TemplateName>
            </Container>
          </CenterPanelWrapper>
          <BottomRow>
            <ButtonGroup>
              <CancelButton text="Cancel" onClick={this.props.toggleModal} />
              <PrimaryButton text="Unpublish" onClick={this.unpublish} />
            </ButtonGroup>
          </BottomRow>
        </Modal>
      </BackDrop>
    );
  }
}

export default connect(() => { return {} }, mapDispatchToProps)(UnpublishModal);
