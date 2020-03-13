import React from 'react';
import { connect } from 'react-redux';
import { BackDrop, Modal } from './styled';
import { PrimaryButton } from 'office-ui-fabric-react';
import ModalHOC from '../../../utils/ModalHOC';
import { RootState } from '../../../store/rootReducer';
import { ModalState } from '../../../store/page/types';
import { closeModal } from '../../../store/page/actions';
import { updateTemplate } from '../../../store/currentTemplate/actions';
import * as ACDesigner from 'adaptivecards-designer';

const mapStateToProps = (state: RootState) => {
  return {
    templateID: state.currentTemplate.templateID,
    templateJSON: state.currentTemplate.templateJSON,
    templateName: state.currentTemplate.templateName,
    sampleDataJSON: state.currentTemplate.sampleDataJSON
  }
}
interface Props {
  templateID: string;
  templateName: string;
  templateJSON: string;
  sampleDataJSON: string;
  closeModal: () => void;
  updateTemplate: (templateID: string, currentVersion: string, templateJSON: string, templateName: string, sampleDataJSON: string) => any; 

  sampleData: string;
}

const mapDispatchToProps = (dispatch: any) => {
  return { 
    closeModal: () => {
      dispatch(closeModal());
    },
    updateTemplate: (templateID: string, currentVersion: string, templateJSON: string, templateName: string, sampleDataJSON: string) => {
      dispatch(updateTemplate(templateID, undefined, templateJSON,templateName,sampleDataJSON));
    } 
  }
}

class SaveModal extends React.Component<Props> {

  onClick = () => {
    if (this.props.templateJSON !== JSON.stringify(designer.getCard()) || this.props.sampleDataJSON !== designer.sampleData){
    //this.props.updateTemplate(this.props.templateID, "1.0", JSON.stringify(designer.getCard()), this.props.templateName, designer.sampleData);
    // do some stuff to save the template 
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