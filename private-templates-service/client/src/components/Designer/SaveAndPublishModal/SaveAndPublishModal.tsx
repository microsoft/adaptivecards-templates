import React from 'react';

import { connect } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { closeModal, openModal } from '../../../store/page/actions';
import { updateTemplate } from '../../../store/currentTemplate/actions';
import { ModalState } from '../../../store/page/types';

import Tags from '../../Common/Tags';

import { PostedTemplate, Template } from 'adaptive-templating-service-typescript-node';
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
  Card,
  StyledH3,
  StyledTextField,
  BottomRow,
  ButtonGroup,
  CancelButton,
  PublishButton
} from './styled';
import { Container, ACWrapper, TemplateFooterWrapper, TemplateName, TemplateStateWrapper } from '../../AdaptiveCardPanel/styled';
import { StatusIndicator, Status, TagsWrapper } from '../../Dashboard/PreviewModal/TemplateInfo/styled';
import { getVersionNumber } from '../../../utils/TemplateUtil/TemplateUtil';

interface Props {
  designerTemplateJSON: object;
  designerSampleDataJSON: object;

  template?: Template;
  templateID?: string;
  templateJSON?: object;
  templateName?: string;
  sampleDataJSON?: object
  templateVersion?: string;

  openModal: (modalState: ModalState) => void;
  closeModal: () => void;
  saveAndPublishTemplate: (templateJSON?: object, sampleDataJSON?: object, templateName?: string, templateTags?: string[]) => void;
}

interface State {
  tags: string[];
  templateName: string;
}

const mapStateToProps = (state: RootState) => {
  return {
    template: state.currentTemplate.template,
    templateID: state.currentTemplate.templateID,
    templateJSON: state.currentTemplate.templateJSON,
    templateName: state.currentTemplate.templateName,
    sampleDataJSON: state.currentTemplate.sampleDataJSON,
    version: state.currentTemplate.version
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    openModal: (modalState: ModalState) => {
      dispatch(openModal(modalState));
    },
    closeModal: () => {
      dispatch(closeModal());
    },
    saveAndPublishTemplate: (templateJSON?: object, sampleDataJSON?: object, templateName?: string, templateTags?: string[]) => {
      dispatch(updateTemplate(undefined, undefined, templateJSON, sampleDataJSON, templateName, PostedTemplate.StateEnum.Live, templateTags));
    }
  }
}

class SaveAndPublishModal extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      tags: this.getTags(this.props.template),
      templateName: (this.props.templateName ? this.props.templateName : STRINGS.UNTITLEDCARD)
    }
  }

  getTags = (template?: Template): Array<string> => {
    return template && template.tags ? template.tags : [];
  }

  saveTags = (tagsToUpdate: string[]) => {
    this.setState({ tags: tagsToUpdate });
  }

  tagRemove = (tag: string) => {
    const newTags = this.state.tags.filter((existingTag: string) => existingTag !== tag);
    this.setState({ tags: newTags });
  }

  onChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    if (newValue) {
      this.setState({ templateName: newValue });
    }
  }

  onSaveAndPublish = () => {
    this.props.saveAndPublishTemplate(this.props.designerTemplateJSON, this.props.designerSampleDataJSON, this.state.templateName, this.state.tags);
    this.props.openModal(ModalState.Share);
  }

  getNewTemplateVersion = (): string => {
    if (this.props.template && this.props.templateVersion) {
      return getVersionNumber(this.props.template, this.props.templateVersion);
    }
    return "1.0";
  }

  render() {
    let adaptiveCard = new AdaptiveCards.AdaptiveCard();
    adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
      fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
    });
    adaptiveCard.parse(this.props.designerTemplateJSON);
    let renderedCard = adaptiveCard.render();

    return (
      <BackDrop>
        <Modal aria-label={STRINGS.SAVE_AND_PUBLISH_CARD}>
          <Header>{STRINGS.SAVE_AND_PUBLISH_CARD}</Header>
          <Description>
            {STRINGS.SAVE_AND_PUBLISH_DESC}
            <DescriptionAccent>
              {this.props.templateName} - {this.getNewTemplateVersion()}
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
                  <TemplateName>{this.props.templateName ? this.props.templateName : STRINGS.UNTITLEDCARD}</TemplateName>
                  <TemplateStateWrapper style={{ justifyContent: "flex-end" }}>
                    <StatusIndicator state={PostedTemplate.StateEnum.Live} />
                    <Status>{STRINGS.LIVE}</Status>
                  </TemplateStateWrapper>
                </TemplateFooterWrapper>
              </Container>
            </CenterPanelLeft>
            <CenterPanelRight>
              <StyledH3>{STRINGS.CARDNAME}</StyledH3>
              <StyledTextField
                onChange={this.onChange}
                placeholder={STRINGS.MYCARD}
                defaultValue={this.props.templateName ? this.props.templateName : STRINGS.UNTITLEDCARD}
              />
              <StyledH3>{STRINGS.TAGS}</StyledH3>
              <TagsWrapper>
                <Tags updateTags={this.saveTags} tagRemove={this.tagRemove} tags={this.state.tags} allowAddTag={true} allowEdit={true} />
              </TagsWrapper>
            </CenterPanelRight>
          </CenterPanelWrapper>
          <BottomRow>
            <ButtonGroup>
              <CancelButton text={STRINGS.CANCEL} onClick={this.props.closeModal} />
              <PublishButton text={STRINGS.SAVE_AND_PUBLISH} onClick={this.onSaveAndPublish} />
            </ButtonGroup>
          </BottomRow>
        </Modal>
      </BackDrop>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SaveAndPublishModal);