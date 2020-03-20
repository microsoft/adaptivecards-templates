import React from 'react';
import { connect } from 'react-redux';
import { BackDrop, Modal, TitleWrapper, ColumnWrapper, InfoWrapper, CardWrapper, ButtonWrapper, MiddleRowWrapper } from './styled';
import { PrimaryButton } from 'office-ui-fabric-react';
import ModalHOC from '../../../utils/ModalHOC';
import { RootState } from '../../../store/rootReducer';
import { ModalState } from '../../../store/page/types';
import { closeModal } from '../../../store/page/actions';
import { updateTemplate } from '../../../store/currentTemplate/actions';
import { PostedTemplate } from 'adaptive-templating-service-typescript-node';

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
      dispatch(updateTemplate(templateID, currentVersion, templateJSON, sampleDataJSON,templateName,));
    } 
  }
}

class SaveModal extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
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
    return(
      <BackDrop>
        <Modal>
          <ColumnWrapper>
            <TitleWrapper>
              <div>Save card</div>
              <div>Your card will be saved as a draft until you publish it to your organization.</div>
            </TitleWrapper>
            <MiddleRowWrapper>
              <CardWrapper>
                <div>card goes here</div>
              </CardWrapper>
              <InfoWrapper>
                <div>card name</div>
                <div>enter card name</div>
                <div>tags + add tags</div>
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