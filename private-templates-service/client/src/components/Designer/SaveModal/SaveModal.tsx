import React from 'react';
import { connect } from 'react-redux';
import { Status, StatusIndicator} from '../../Dashboard/PreviewModal/TemplateInfo/styled';
import ModalHOC from '../../../utils/ModalHOC';
import { RootState } from '../../../store/rootReducer';
import { closeModal } from '../../../store/page/actions';
import { updateTemplate } from '../../../store/currentTemplate/actions';
import { PostedTemplate } from 'adaptive-templating-service-typescript-node';
import * as AdaptiveCards from "adaptivecards";
import Tags from '../../Common/Tags';

import { Container, TemplateName, ACWrapper, TemplateFooterWrapper, TemplateStateWrapper } from '../../AdaptiveCardPanel/styled';
import { 
  BackDrop,
  Modal, 
  TitleWrapper, 
  ColumnWrapper, 
  InfoWrapper,
  ButtonWrapper, 
  MiddleRowWrapper, 
  Card, 
  StyledTitle, 
  StyledH3, 
  TagsWrapper, 
  StyledCancelButton, 
  StyledSaveButton, 
  StyledTextField } from './styled';

const mapStateToProps = (state: RootState) => {
  return {
    templateID: state.currentTemplate.templateID,
    templateJSON: state.currentTemplate.templateJSON,
    templateName: state.currentTemplate.templateName,
    sampleDataJSON: state.currentTemplate.sampleDataJSON,
    version: state.currentTemplate.version
  }
}

interface Props {
  templateID?: string;
  templateName?: string;
  sampleDataJSON?: object;
  templateJSON?: object;
  designerSampleData?: any;
  designerTemplateJSON?: any;
  version?: string;
  closeModal: () => void;
  updateTemplate: (templateID?: string, currentVersion?: string, templateJSON?: object, sampleDataJSON?: object, templateName?: string, state?: PostedTemplate.StateEnum, tags?: string[], isShareable?: boolean ) => any; 
}

interface State {
  tags: string[];
  templateName: string;
}

const mapDispatchToProps = (dispatch: any) => {
  return { 
    closeModal: () => {
      dispatch(closeModal());
    },
    updateTemplate: (templateID?: string, currentVersion?: string, templateJSON?: object, sampleDataJSON?: object, templateName?: string, templateState?: PostedTemplate.StateEnum, templateTags?:string[]) => {
      dispatch(updateTemplate(templateID, currentVersion, templateJSON, sampleDataJSON, templateName, templateState, templateTags));
    } 
  }
}

class SaveModal extends React.Component<Props,State> {
  constructor(props: Props) {
    super(props);
    this.state = {tags : [], templateName:"Untitled Template"}
  }

  saveTags = (tagsToUpdate: string[]) => {
    this.setState({tags: tagsToUpdate});
  }

  tagRemove = (tag: string) => {
    const newTags = this.state.tags.filter((existingTag: string) => existingTag !== tag);
    this.setState({tags: newTags});

  }

  onChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    if(newValue){
      this.setState({templateName: newValue});
    }
  }

  onClick = () => {
    // will only trigger on first save
    if(JSON.stringify(this.props.sampleDataJSON) !== JSON.stringify(this.props.designerTemplateJSON) || this.props.sampleDataJSON !== this.props.designerSampleData ){
      this.props.updateTemplate(undefined,undefined,this.props.designerTemplateJSON,this.props.designerSampleData,this.state.templateName,PostedTemplate.StateEnum.Draft,this.state.tags);
    }
    this.props.closeModal();
  }
  
  render(){ 
    var adaptiveCard = new AdaptiveCards.AdaptiveCard();
    adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
      fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
    });
    adaptiveCard.onExecuteAction = function(action) { alert("Ow!"); }
    adaptiveCard.parse(this.props.designerTemplateJSON);
    var renderedCard = adaptiveCard.render();
    
    return(
      <BackDrop>
        <Modal>
          <ColumnWrapper>
            <TitleWrapper>
              <StyledTitle> Save Card </StyledTitle>
              <div>Your card will be saved as a draft until you publish it to your organization.</div>
            </TitleWrapper>
            <MiddleRowWrapper>
              <Container>
                <ACWrapper>
                  <Card ref={n => {
                    // Work around for known issue: https://github.com/gatewayapps/react-adaptivecards/issues/10
                    n && n.firstChild && n.removeChild(n.firstChild);
                    n && n.appendChild(renderedCard);
                  }}/>
                </ACWrapper>
                <TemplateFooterWrapper style={{justifyContent:"space-between", paddingRight:"20px"}}>
                  <TemplateName> Untitled Card </TemplateName>
                  <TemplateStateWrapper style={{justifyContent:"flex-end"}}>
                    <StatusIndicator state={PostedTemplate.StateEnum.Draft}/>
                    <Status> Draft </Status>
                  </TemplateStateWrapper>
                </TemplateFooterWrapper>
              </Container>
              <InfoWrapper>
                <StyledH3>Card Name</StyledH3>
                <StyledTextField onChange={this.onChange}/>
                <StyledH3>Tags</StyledH3>
                <TagsWrapper>
                  <Tags updateTags = {this.saveTags} tagRemove = {this.tagRemove} tags={this.state.tags} allowAddTag={true} allowEdit={true} />
                </TagsWrapper>
              </InfoWrapper>
            </MiddleRowWrapper>
            <ButtonWrapper>
              <StyledCancelButton text = "Cancel" onClick={this.props.closeModal} />
              <StyledSaveButton text = "Save" onClick={this.onClick}/>
            </ButtonWrapper>
          </ColumnWrapper>
        </Modal>
      </BackDrop>
    )
  }  
}

export default ModalHOC(connect(mapStateToProps, mapDispatchToProps)(SaveModal));