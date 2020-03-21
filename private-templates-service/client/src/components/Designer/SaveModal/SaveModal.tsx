import React from 'react';
import { connect } from 'react-redux';
import { BackDrop, Modal, TitleWrapper, ColumnWrapper, InfoWrapper, CardWrapper, ButtonWrapper, MiddleRowWrapper, Card, StyledTitle } from './styled';
import { PrimaryButton } from 'office-ui-fabric-react';
import ModalHOC from '../../../utils/ModalHOC';
import { RootState } from '../../../store/rootReducer';
import { ModalState } from '../../../store/page/types';
import { closeModal } from '../../../store/page/actions';
import { updateTemplate } from '../../../store/currentTemplate/actions';
import { PostedTemplate } from 'adaptive-templating-service-typescript-node';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import  AdaptiveCard from '../../Common/AdaptiveCard';
import * as AdaptiveCards from "adaptivecards";
import * as ACData from "adaptivecards-templating";
import Tags from '../../Common/Tags';


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
  closeModal: () => void;
  updateTemplate: (templateID?: string, currentVersion?: string, templateJSON?: object, sampleDataJSON?: object, templateName?: string, state?: PostedTemplate.StateEnum, tags?: string[], isShareable?: boolean ) => any; 

  designerSampleData?: any;
  designerTemplateJSON?: any;
  version?: string;
  
}

const mapDispatchToProps = (dispatch: any) => {
  return { 
    closeModal: () => {
      dispatch(closeModal());
    },
    updateTemplate: (templateID?: string, currentVersion?: string, templateJSON?: object, sampleDataJSON?: object, templateName?: string) => {
      dispatch(updateTemplate(templateID, currentVersion, templateJSON, sampleDataJSON, templateName,));
    } 
  }
}

class SaveModal extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    let tags: string[] = []
  }
  
  saveTags = (tagsToUpdate: string[]) => {
    //tags = tagsToUpdate
  }

  onClick = () => {
    // this will be for the first time saving
    console.log("props before save",this.props);
    if(JSON.stringify(this.props.sampleDataJSON) !== JSON.stringify(this.props.designerTemplateJSON) || this.props.sampleDataJSON !== this.props.designerSampleData ){
      console.log("inside 1")
      console.log (typeof(this.props.designerTemplateJSON),"template",typeof(this.props.designerSampleData),"data");
      this.props.updateTemplate(undefined,undefined,this.props.designerTemplateJSON,this.props.designerSampleData,undefined);
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
    


    let tags: string[] = [];
    return(
      <BackDrop>
        <Modal>
          <ColumnWrapper>
            <TitleWrapper>
              <StyledTitle> Save Card </StyledTitle>
              <div>Your card will be saved as a draft until you publish it to your organization.</div>
            </TitleWrapper>
            <MiddleRowWrapper>
              <CardWrapper>
                <Card ref={n => {
                  // Work around for known issue: https://github.com/gatewayapps/react-adaptivecards/issues/10
                  n && n.firstChild && n.removeChild(n.firstChild);
                  n && n.appendChild(renderedCard);
                }}/>
              </CardWrapper>
              <InfoWrapper>
                <TextField label="Card Name" />
                <Tags updateTags = {this.saveTags} tags={tags} allowAddTag={true} allowEdit={true} />
              </InfoWrapper>
            </MiddleRowWrapper>
            <ButtonWrapper>
              <PrimaryButton text = "Cancel" onClick={this.props.closeModal} />
              <PrimaryButton text = "Save" onClick={this.onClick}/>
            </ButtonWrapper>
          </ColumnWrapper>
        </Modal>
      </BackDrop>
    )
  }  
}

export default ModalHOC(connect(mapStateToProps, mapDispatchToProps)(SaveModal));