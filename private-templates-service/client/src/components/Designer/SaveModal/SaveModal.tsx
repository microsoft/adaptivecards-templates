import React from 'react';
import { connect } from 'react-redux';
import { BackDrop, Modal } from './styled';
import { PrimaryButton } from 'office-ui-fabric-react';
import ModalHOC from '../../../utils/ModalHOC';
import { RootState } from '../../../store/rootReducer';
import { ModalState } from '../../../store/page/types';
import { closeModal } from '../../../store/page/actions';
import { updateTemplate } from '../../../store/currentTemplate/actions';
import { version } from 'react-dom';

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
  updateTemplate: (templateID: string, currentVersion: string, templateJSON: object, sampleDataJSON: object,templateName: string,) => any; 

  designerSampleData?: any;
  designerTemplateJSON?: any;
  version?: string;
}

const mapDispatchToProps = (dispatch: any) => {
  return { 
    closeModal: () => {
      dispatch(closeModal());
    },
    updateTemplate: (templateID: string, currentVersion: string, templateJSON: object, sampleDataJSON: object, templateName: string) => {
      dispatch(updateTemplate(templateID, currentVersion, templateJSON, sampleDataJSON,templateName,));
    } 
  }
}

class SaveModal extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  onClick = () => {
    console.log("props before save",this.props);
    if ((this.props.templateJSON !== this.props.designerTemplateJSON || this.props.sampleDataJSON !== this.props.designerTemplateJSON) && this.props.templateID && this.props.version && this.props.templateName){
      this.props.updateTemplate(this.props.templateID, this.props.version, this.props.designerTemplateJSON, this.props.designerSampleData, this.props.templateName);
      console.log("props after save ",this.props);
      this.props.closeModal();
    }
  }
  render(){ 
    return(
      <BackDrop>
        <Modal>
          <h1>hello</h1>
          <PrimaryButton text = "close" onClick={this.props.closeModal} />
          <PrimaryButton text = "Save" onClick={this.onClick}/>
        </Modal>
      </BackDrop>
    )
  }  
}

export default ModalHOC(connect(mapStateToProps, mapDispatchToProps)(SaveModal));