import React from 'react';

import { connect } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { closeModal } from '../../../store/page/actions';
import { updateTemplate } from '../../../store/currentTemplate/actions';
import { ModalState } from '../../../store/page/types';

import { PostedTemplate } from 'adaptive-templating-service-typescript-node';
import * as AdaptiveCards from 'adaptivecards';

import * as STRINGS from '../../../assets/strings';

import {
  BackDrop,
  Modal,
  Header,
  Description,
  DescriptionAccent,
  CenterPanelWrapper,
  CenterPanelLeft,
  CenterPanelRight,
  Card
} from './styled';
import { Container, ACWrapper, TemplateFooterWrapper, TemplateName, TemplateStateWrapper } from '../../AdaptiveCardPanel/styled';
import { StatusIndicator, Status } from '../../Dashboard/PreviewModal/TemplateInfo/styled';

interface Props {
  designerTemplateJSON: object;
  designerSampleDataJSON: object;
  openModal: (modalState: ModalState) => void;
  closeModal: () => void;
  saveAndPublishTemplate: (templateJSON?: object, sampleDataJSON?: object, templateName?: string, templateTags?: string[]) => void;

  templateID?: string;
  templateJSON?: object;
  templateName?: string;
  sampleDataJSON?: object
  templateVersion?: string;
}

const mapStateToProps = (state: RootState) => {
  return {
    templateID: state.currentTemplate.templateID,
    templateJSON: state.currentTemplate.templateJSON,
    templateName: state.currentTemplate.templateName,
    sampleDataJSON: state.currentTemplate.sampleDataJSON,
    version: state.currentTemplate.version
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    closeModal: () => {
      dispatch(closeModal());
    },
    saveAndPublishTemplate: (templateJSON?: object, sampleDataJSON?: object, templateName?: string, templateTags?: string[]) => {
      dispatch(updateTemplate(undefined, undefined, templateJSON, sampleDataJSON, templateName, PostedTemplate.StateEnum.Live, templateTags));
    }
  }
}

class SaveAndPublishModal extends React.Component<Props> {
  render() {

    let adaptiveCard = new AdaptiveCards.AdaptiveCard();
    adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
      fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
    });
    adaptiveCard.parse(this.props.designerTemplateJSON);
    let renderedCard = adaptiveCard.render();

    return (
      <BackDrop>
        <Modal>
          <Header>{STRINGS.SAVE_AND_PUBLISH_CARD}</Header>
          <Description>
            {STRINGS.SAVE_AND_PUBLISH_DESC}
            <DescriptionAccent>
              {this.props.templateName} - {this.props.templateVersion ? this.props.templateVersion : "1.0"}
            </DescriptionAccent>
          </Description>
          <CenterPanelWrapper>
            <CenterPanelLeft>
              <Container style={{ margin: "0 80px 24px 0" }} >
                <ACWrapper>
                  <Card ref={n => {
                    // Work around for known issue: https://github.com/gatewayapps/react-adaptivecards/issues/10
                    n && n.firstChild && n.removeChild(n.firstChild);
                    n && n.appendChild(renderedCard);
                  }} />
                </ACWrapper>
                <TemplateFooterWrapper style={{ justifyContent: "space-between", paddingRight: "20px" }}>
                  <TemplateName>{this.props.templateName && this.props.templateName !== "" ? this.props.templateName : STRINGS.UNTITLEDCARD}</TemplateName>
                  <TemplateStateWrapper style={{ justifyContent: "flex-end" }}>
                    <StatusIndicator state={PostedTemplate.StateEnum.Draft} />
                    <Status>{STRINGS.DRAFT}</Status>
                  </TemplateStateWrapper>
                </TemplateFooterWrapper>
              </Container>
            </CenterPanelLeft>
            <CenterPanelRight>

            </CenterPanelRight>
          </CenterPanelWrapper>
        </Modal>
      </BackDrop>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SaveAndPublishModal);