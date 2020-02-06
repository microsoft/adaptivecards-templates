import React, { useEffect } from 'react';
import { RootState } from '../../store/rootReducer';
import requireAuthentication from '../../utils/requireAuthentication';
import { connect } from 'react-redux';
import { UserType } from '../../store/auth/types';
import { useHistory } from 'react-router-dom';
//ACDesigner
import * as monaco from 'monaco-editor';
import markdownit from 'markdown-it';
import * as ACDesigner from 'adaptivecards-designer';

const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
  };
};

interface DesignerProps {
  isAuthenticated: boolean;
  user?: UserType;
  authButtonMethod: () => Promise<void>;
}

const Designer = () => {

  //useEffect(() => {
  ACDesigner.GlobalSettings.enableDataBindingSupport = true;
  ACDesigner.GlobalSettings.showSampleDataEditorToolbox = true;

  ACDesigner.CardDesigner.onProcessMarkdown = (text: string, result: { didProcess: boolean, outputHtml?: string }) => {
    result.outputHtml = new markdownit().render(text);
    result.didProcess = true;
  }

  let hostContainers: Array<ACDesigner.HostContainer> = initHostContainers();

  let designer = new ACDesigner.CardDesigner(hostContainers);
  designer.sampleCatalogueUrl = window.location.origin;
  designer.assetPath = window.location.origin;

  let history = useHistory();
  let closeButton = new ACDesigner.ToolbarButton("closeButton", "Close", "", (sender) => (history.goBack()));

  closeButton.separator = true;
  designer.toolbar.insertElementAfter(closeButton, ACDesigner.CardDesigner.ToolbarCommands.TogglePreview);

  const element = document.getElementById("root");
  if (element) {
    designer.attachTo(element);
  }

  //Example of how to export data from designer
  console.log("Adaptive Card Template: " + designer.getCard());
  console.log("Adaptive Card Sample Data: " + designer.sampleData);

  designer.monacoModuleLoaded(monaco);
  // }, []);



  return <div id="root" dangerouslySetInnerHTML={{ __html: "dangerouslySetACDesigner" }}></div>;
}

function initHostContainers(): Array<ACDesigner.HostContainer> {
  let hostContainers: Array<ACDesigner.HostContainer> = [];

  hostContainers.push(new ACDesigner.WebChatContainer("Bot Framework WebChat", "containers/webchat-container.css"));
  hostContainers.push(new ACDesigner.CortanaContainer("Cortana Skills", "containers/cortana-container.css"));
  hostContainers.push(new ACDesigner.OutlookContainer("Outlook Actionable Messages", "containers/outlook-container.css"));
  hostContainers.push(new ACDesigner.TimelineContainer("Windows Timeline", "containers/timeline-container.css"));
  hostContainers.push(new ACDesigner.DarkTeamsContainer("Microsoft Teams - Dark", "containers/teams-container-dark.css"));
  hostContainers.push(new ACDesigner.LightTeamsContainer("Microsoft Teams - Light", "containers/teams-container-light.css"));
  hostContainers.push(new ACDesigner.BotFrameworkContainer("Bot Framework Other Channels (Image render)", "containers/bf-image-container.css"));
  hostContainers.push(new ACDesigner.ToastContainer("Windows Notifications (Preview)", "containers/toast-container.css"));

  return hostContainers;
}
export default connect(mapStateToProps)(requireAuthentication(Designer));
