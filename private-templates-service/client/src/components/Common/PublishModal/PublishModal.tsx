import React from 'react';
import { connect } from 'react-redux';

// Libraries
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton, ThemeSettingName } from 'office-ui-fabric-react'
import { SearchBox } from 'office-ui-fabric-react';

import { Template } from 'adaptive-templating-service-typescript-node';

// Redux
import { updateTemplate } from '../../../store/currentTemplate/actions';

// Components
import AdaptiveCard from '../AdaptiveCard';

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
} from './styled';

interface Props {
  template: Template;
  templateVersion: string;
  toggleModal: () => void;
  publishTemplate: (templateID: string, templateJSON: string, sampleDataJSON: string, templateName: string) => void;
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    publishTemplate: (templateID: string, templateJSON: string, sampleDataJSON: string, templateName: string) => {
      dispatch(updateTemplate(templateID, templateJSON, sampleDataJSON, templateName, true));
    }
  }
}

class PublishModal extends React.Component<Props> {

  publish = () => {
    const {
      id,
      name,
      instances
    } = this.props.template;
    if (id && name && instances && instances.length === 1 && instances[0].json) {
      const template = instances[0].json;
      const parsedTemplate = JSON.stringify(template);
      this.props.publishTemplate(id, parsedTemplate, "", name);
      this.props.toggleModal();
    }
  }

  render() {
    const { template } = this.props;

    return (
      <BackDrop>
        <Modal>
          <Header>Publish Template</Header>
          <Description>Your template design will be sent for review. Once approved, your new design will go live as <DescriptionAccent>{template.name}</DescriptionAccent></Description>
          <CenterPanelWrapper>
            <CenterPanelLeft>
              <AdaptiveCardPanel>
                <AdaptiveCard cardtemplate={template} templateVersion={this.props.templateVersion} />
              </AdaptiveCardPanel>
              <SemiBoldText>
                Notified
              </SemiBoldText>
              <SearchBox placeholder="Search for people" />
            </CenterPanelLeft>
            <CenterPanelRight>
              <TextField label="Comments" placeholder="Enter any comments you may have for your reviewers to see. (Optional)" multiline autoAdjustHeight />
            </CenterPanelRight>
          </CenterPanelWrapper>
          <BottomRow>
            <NotifiedGroup>
              FACES HERE
            </NotifiedGroup>
            <ButtonGroup>
              <CancelButton text="Cancel" onClick={this.props.toggleModal} />
              <PrimaryButton text="Publish" onClick={this.publish} />
            </ButtonGroup>
          </BottomRow>
        </Modal>
      </BackDrop>
    );
  }
}

export default connect(() => { return {} }, mapDispatchToProps)(PublishModal);
