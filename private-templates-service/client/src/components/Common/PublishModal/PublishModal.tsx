import React from 'react';
import { connect } from 'react-redux';

// Libraries
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from 'office-ui-fabric-react';
import { SearchBox } from 'office-ui-fabric-react';

import { Template, PostedTemplate } from 'adaptive-templating-service-typescript-node';

// Redux
import { updateTemplate } from '../../../store/currentTemplate/actions';

// Components
import AdaptiveCard from '../AdaptiveCard';
import ModalHOC from '../../../utils/ModalHOC';

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
  publishTemplate: (templateVersion: string) => void;
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    publishTemplate: (templateVersion: string) => {
      dispatch(updateTemplate(undefined, templateVersion, undefined, undefined, undefined, PostedTemplate.StateEnum.Live));
    }
  }
}

class PublishModal extends React.Component<Props> {

  publish = () => {
    // TODO: kodyang, grzhang PUBLISH CURRENT VERSION, NOT 1ST VERSION
    this.props.publishTemplate(this.props.templateVersion);
    this.props.toggleModal();
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

export default ModalHOC(connect(() => { return {} }, mapDispatchToProps)(PublishModal));
