import React from 'react';
import requireAuthentication from '../../utils/requireAuthentication';

import { RootState } from '../../store/rootReducer';
import { connect } from 'react-redux';
import { updateTemplate } from '../../store/currentTemplate/actions';

//ACDesigner
import * as monaco from 'monaco-editor';
import markdownit from 'markdown-it';
import * as ACDesigner from 'adaptivecards-designer';
import { setPage, openModal } from '../../store/page/actions';
import { DesignerWrapper } from './styled';

import EditNameModal from '../Common/EditNameModal';
import SaveModal from './SaveModal/SaveModal';
import { ModalState } from '../../store/page/types';

const mapStateToProps = (state: RootState) => {
  return {
    templateID: state.currentTemplate.templateID,
    templateJSON: state.currentTemplate.templateJSON,
    templateName: state.currentTemplate.templateName,
    sampleDataJSON: state.currentTemplate.sampleDataJSON,
    modalState: state.page.modalState,
    version: state.currentTemplate.version,
    isFetching: state.currentTemplate.isFetching
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    updateTemplate: (templateID: string, currentVersion: string, templateJSON: object, sampleDataJSON: object, templateName: string) => {
      dispatch(updateTemplate(templateID, currentVersion, templateJSON, sampleDataJSON, templateName));
    },
    setPage: (currentPageTitle: string, currentPage: string) => {
      dispatch(setPage(currentPageTitle, currentPage));
    },
    openModal: (modalState: ModalState) => {
      dispatch(openModal(modalState));
    }
  }
}

interface DesignerProps {
  templateID: string;
  templateJSON: object;
  templateName: string;
  sampleDataJSON: object;
  version: string;
  updateTemplate: (templateID: string, currentVersion: string, templateJSON: object, sampleDataJSON: object, templateName: string) => any;
  setPage: (currentPageTitle: string, currentPage: string) => void;
  toggleModal: () => void;
  openModal: (modalState: ModalState) => void;
  modalState?: ModalState;
  isFetching: boolean;
}

interface State { 
  isSaveOpen: boolean;
}

let designer: ACDesigner.CardDesigner;

class Designer extends React.Component<DesignerProps,State> {
  constructor(props: DesignerProps) {
    super(props);
    props.setPage(this.props.templateName, "Designer");
    this.state = {isSaveOpen: false };
  }

  toggleModal = () => {
    this.setState({isSaveOpen: !this.state.isSaveOpen});
  }
  componentWillMount() {
    ACDesigner.GlobalSettings.enableDataBindingSupport = true;
    ACDesigner.GlobalSettings.showSampleDataEditorToolbox = true;

    ACDesigner.CardDesigner.onProcessMarkdown = (text: string, result: { didProcess: boolean, outputHtml?: string }) => {
      result.outputHtml = new markdownit().render(text);
      result.didProcess = true;
    }
    designer = initDesigner();

    let publishButton = new ACDesigner.ToolbarButton("publishButton", "Publish", "", (sender) => (alert("Published!")));
    publishButton.separator = true;
    designer.toolbar.insertElementAfter(publishButton, ACDesigner.CardDesigner.ToolbarCommands.TogglePreview);

    let saveButton = new ACDesigner.ToolbarButton("saveButton", "Save", "", (sender) => (onSave(designer, this.props)));
    saveButton.separator = true;
    designer.toolbar.insertElementAfter(saveButton, ACDesigner.CardDesigner.ToolbarCommands.TogglePreview);
  }

  componentDidMount() {
    const element = document.getElementById("designer-container");
    if (element) {
      designer.attachTo(element);
    }
    designer.monacoModuleLoaded(monaco);

    if (this.props.templateJSON) {
      designer.setCard(this.props.templateJSON);
    }

    if (this.props.sampleDataJSON) {
      designer.sampleData = this.props.sampleDataJSON;
    }
    else {
      designer.sampleData = {};
    }

    // TODO: REMOVE ONCE PUBLISH IS COMPLETED IN DESIGNER
    const buttons = document.getElementsByClassName('acd-toolbar-button');
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].innerHTML === 'Publish') {
        (buttons[i] as HTMLElement).style.color = 'pink';
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <DesignerWrapper id="designer-container" />
        {this.props.modalState===ModalState.Save && <SaveModal designerSampleData = {designer.sampleData} designerTemplateJSON = {designer.getCard()}/>}
        {this.props.modalState === ModalState.EditName && <EditNameModal />}
      </React.Fragment>
    );
  }
}

function initDesigner(): ACDesigner.CardDesigner {
  let hostContainers: Array<ACDesigner.HostContainer> = [];

  hostContainers.push(new ACDesigner.WebChatContainer("Bot Framework WebChat", "containers/webchat-container.css"));
  hostContainers.push(new ACDesigner.CortanaContainer("Cortana Skills", "containers/cortana-container.css"));
  hostContainers.push(new ACDesigner.OutlookContainer("Outlook Actionable Messages", "containers/outlook-container.css"));
  hostContainers.push(new ACDesigner.TimelineContainer("Windows Timeline", "containers/timeline-container.css"));
  hostContainers.push(new ACDesigner.DarkTeamsContainer("Microsoft Teams - Dark", "containers/teams-container-dark.css"));
  hostContainers.push(new ACDesigner.LightTeamsContainer("Microsoft Teams - Light", "containers/teams-container-light.css"));
  hostContainers.push(new ACDesigner.BotFrameworkContainer("Bot Framework Other Channels (Image render)", "containers/bf-image-container.css"));
  hostContainers.push(new ACDesigner.ToastContainer("Windows Notifications (Preview)", "containers/toast-container.css"));

  let designer = new ACDesigner.CardDesigner(hostContainers);
  designer.sampleCatalogueUrl = window.location.origin + "/ACDesigner";
  designer.assetPath = window.location.origin + "/ACDesigner";

  return designer;
}

function onSave(designer: ACDesigner.CardDesigner, props: DesignerProps): void {
  if(props.templateID === "" || props.templateID === undefined){
    props.openModal(ModalState.Save);
  }
  else if (JSON.stringify(props.templateJSON) !== JSON.stringify(designer.getCard()) || props.sampleDataJSON !== designer.sampleData){ 
    props.updateTemplate(props.templateID, props.version, designer.getCard(), designer.sampleData, props.templateName);  
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireAuthentication(Designer));
