import React from 'react';
import requireAuthentication from '../../utils/requireAuthentication';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { RootState } from '../../store/rootReducer';
import { connect } from 'react-redux';
import { ModalState } from '../../store/page/types';
import { setPage, openModal } from '../../store/page/actions';
import { updateTemplate, getTemplate } from '../../store/currentTemplate/actions';

//ACDesigner
import * as monaco from 'monaco-editor';
import markdownit from 'markdown-it';
import * as ACDesigner from 'adaptivecards-designer';
import {
  OuterDesignerWrapper,
  DesignerWrapper
} from './styled';

import EditNameModal from '../Common/EditNameModal';
import SaveModal from './SaveModal/SaveModal';
import SpinnerModal from '../Common/SpinnerModal';
import SaveAndPublishModal from './SaveAndPublishModal/SaveAndPublishModal';
import ShareModal from '../Common/ShareModal';
import { Template } from 'adaptive-templating-service-typescript-node';
import ShareSuccessModal from '../Common/ShareModal/ShareSuccessModal';

import { DESIGNER_PUBLISH, DESIGNER_SAVE } from '../../assets/strings';

const mapStateToProps = (state: RootState) => {
  return {
    template: state.currentTemplate.template,
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
    },
    getTemplate: (id: string) => {
      dispatch(getTemplate(id));
    }
  }
}

interface DesignerProps extends RouteComponentProps<MatchParams> {
  template: Template;
  templateID: string;
  templateJSON: object;
  templateName: string;
  sampleDataJSON: object;
  version: string;
  updateTemplate: (templateID: string, currentVersion: string, templateJSON: object, sampleDataJSON: object, templateName: string) => any;
  setPage: (currentPageTitle: string, currentPage: string) => void;
  openModal: (modalState: ModalState) => void;
  getTemplate: (id: string) => void;
  modalState?: ModalState;
  isFetching: boolean;
}

interface MatchParams {
  uuid: string;
  version: string;
}

let designer: ACDesigner.CardDesigner;

class Designer extends React.Component<DesignerProps> {
  constructor(props: DesignerProps) {
    super(props);
    props.setPage(this.props.templateName, "Designer");
    if (this.props.match.params.uuid !== "newcard") {
      this.props.getTemplate(this.props.match.params.uuid);
    }
  }

  componentDidUpdate() {
    if (this.props.location.pathname === '/designer/newcard/1.0' && this.props.templateID && this.props.version) {
      this.props.history.replace('/designer/' + this.props.templateID + '/' + this.props.version);
    }
    if (this.props.templateJSON) {
      designer.setCard({ ...this.props.templateJSON });
    }
    else {
      designer.setCard(require('../../assets/default-adaptivecards/defaultAdaptiveCard.json'));
    }
  }

  componentWillMount() {
    ACDesigner.GlobalSettings.enableDataBindingSupport = true;
    ACDesigner.GlobalSettings.showSampleDataEditorToolbox = true;

    ACDesigner.CardDesigner.onProcessMarkdown = (text: string, result: { didProcess: boolean, outputHtml?: string }) => {
      result.outputHtml = new markdownit().render(text);
      result.didProcess = true;
    }
    designer = initDesigner();

    let publishButton = new ACDesigner.ToolbarButton("publishButton", DESIGNER_PUBLISH, "", (sender) => (this.props.openModal(ModalState.SaveAndPublish)));
    publishButton.separator = true;
    designer.toolbar.insertElementAfter(publishButton, ACDesigner.CardDesigner.ToolbarCommands.TogglePreview);

    let saveButton = new ACDesigner.ToolbarButton("saveButton", DESIGNER_SAVE, "", (sender) => (onSave(designer, this.props)));
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
      designer.setCard({ ...this.props.templateJSON });
    }

    if (this.props.sampleDataJSON) {
      designer.sampleData = this.props.sampleDataJSON;
    }
    else {
      designer.sampleData = {};
    }

  }

  render() {
    return (
      <OuterDesignerWrapper>
        <DesignerWrapper id="designer-container" />
        {this.props.isFetching && <SpinnerModal />}
        {this.props.modalState === ModalState.Save && <SaveModal designerSampleData={designer.sampleData} designerTemplateJSON={designer.getCard()} />}
        {this.props.modalState === ModalState.SaveAndPublish && <SaveAndPublishModal designerTemplateJSON={designer.getCard()} designerSampleDataJSON={designer.sampleData} />}
        {this.props.modalState === ModalState.Share && <ShareModal template={this.props.template} templateVersion={this.props.version} />}
        {this.props.modalState === ModalState.ShareSuccess && <ShareSuccessModal template={this.props.template} templateVersion={this.props.version} />}
        {this.props.modalState === ModalState.EditName && <EditNameModal />}
      </OuterDesignerWrapper>
    );
  }
}

function initDesigner(): ACDesigner.CardDesigner {
  let hostContainers: Array<ACDesigner.HostContainer> = [];

  hostContainers.push(new ACDesigner.WebChatContainer("Bot Framework WebChat", "containers/webchat-container.css"));
  hostContainers.push(new ACDesigner.LightTeamsContainer("Cortana Light", "containers/cortana-container.css"));
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
  if (props.templateID === "" || props.templateID === undefined) {
    props.openModal(ModalState.Save);
  }
  else if (JSON.stringify(props.templateJSON) !== JSON.stringify(designer.getCard()) || props.sampleDataJSON !== designer.sampleData) {
    props.updateTemplate(props.templateID, props.version, designer.getCard(), designer.sampleData, props.templateName);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireAuthentication(withRouter(Designer)));
