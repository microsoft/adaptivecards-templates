import React from 'react';
import requireAuthentication from '../../utils/requireAuthentication';

import { RootState } from '../../store/rootReducer';
import { connect } from 'react-redux';
import { UserType } from '../../store/auth/types';
import { updateTemplate } from '../../store/currentTemplate/actions';

//ACDesigner
import * as monaco from 'monaco-editor';
import markdownit from 'markdown-it';
import * as ACDesigner from 'adaptivecards-designer';
import { setPage } from '../../store/page/actions';

const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    templateID: state.currentTemplate.templateID,
    templateJSON: state.currentTemplate.templateJSON,
    templateName: state.currentTemplate.templateName,
    sampleDataJSON: state.currentTemplate.sampleDataJSON
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    updateTemplate: (templateID: string, templateJSON: string, templateName: string, sampleDataJSON: string) => {
      dispatch(updateTemplate(templateID, templateJSON, templateName, sampleDataJSON));
    },
    setPage: (currentPageTitle: string, currentPage: string) => {
      dispatch(setPage(currentPageTitle, currentPage));
    }
  }
}

interface DesignerProps {
  isAuthenticated: boolean;
  user?: UserType;
  templateID: string;
  templateJSON: string;
  templateName: string;
  sampleDataJSON: string;
  updateTemplate: (templateID: string, templateJSON: string, templateName: string, sampleDataJSON: string) => any;
  setPage: (currentPageTitle: string, currentPage: string) => void;
}

let designer: ACDesigner.CardDesigner;

class Designer extends React.Component<DesignerProps> {
  constructor(props: DesignerProps) {
    super(props);
    props.setPage(this.props.templateName, "Designer");
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

    designer.sampleData = "";
  }

  componentDidMount() {
    const element = document.getElementById("designer-container");
    if (element) {
      designer.attachTo(element);
    }

    designer.monacoModuleLoaded(monaco);
  }

  render() {
    return (
      <div id="designer-container" dangerouslySetInnerHTML={{ __html: "dangerouslySetACDesigner" }}></div>
    );
  }

  shouldComponentUpdate() {
    return false;
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
  if (props.templateJSON !== JSON.stringify(designer.getCard()) || props.sampleDataJSON !== designer.sampleData) {
    props.updateTemplate(props.templateID, JSON.stringify(designer.getCard()), props.templateName, designer.sampleData);
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(requireAuthentication(Designer));
