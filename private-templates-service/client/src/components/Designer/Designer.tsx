import React from 'react';
import { RootState } from '../../store/rootReducer';
import requireAuthentication from '../../utils/requireAuthentication';
import { connect } from 'react-redux';
import { UserType } from '../../store/auth/types';

//ACDesigner
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import markdownit from 'markdown-it';
import * as ACDesigner from 'adaptivecards-designer';

require("adaptivecards-designer/dist/adaptivecards-designer.css");

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

class Designer extends React.Component<DesignerProps>{

  private designer: ACDesigner.CardDesigner | undefined;

  componentDidMount(): void {
    ACDesigner.GlobalSettings.enableDataBindingSupport = true;

    ACDesigner.CardDesigner.onProcessMarkdown = (text: string, result: { didProcess: boolean, outputHtml?: string }) => {
      result.outputHtml = new markdownit().render(text);
      result.didProcess = true;
    }

    let hostContainers: Array<ACDesigner.HostContainer> = [];
    hostContainers.push(new ACDesigner.WebChatContainer("Bot Framework WebChat", "containers/webchat/webchat-container.css"));
    hostContainers.push(new ACDesigner.CortanaContainer("Cortana Skills", "containers/cortana/cortana-container.css"));
    hostContainers.push(new ACDesigner.OutlookContainer("Outlook Actionable Messages", "containers/outlook/outlook-container.css"));
    hostContainers.push(new ACDesigner.TimelineContainer("Windows Timeline", "containers/timeline/timeline-container.css"));
    hostContainers.push(new ACDesigner.DarkTeamsContainer("Microsoft Teams - Dark", "containers/teams/teams-container-dark.css"));
    hostContainers.push(new ACDesigner.LightTeamsContainer("Microsoft Teams - Light", "containers/teams/teams-container-light.css"));
    hostContainers.push(new ACDesigner.BotFrameworkContainer("Bot Framework Other Channels (Image render)", "containers/bf-image/bf-image-container.css"));
    hostContainers.push(new ACDesigner.ToastContainer("Windows Notifications (Preview)", "containers/notifications/toast-container.css"));

    let designer = new ACDesigner.CardDesigner(hostContainers);
    designer.sampleCatalogueUrl = window.location.origin + "/res/sample-catalogue.json";

    this.designer = new ACDesigner.CardDesigner(hostContainers);
    const element = document.getElementById("root");
    if (element) {
      this.designer.attachTo(element);
    }

    //part of basic designer properties
    this.designer.monacoModuleLoaded(monaco);
  }

  render(): React.ReactElement<{}> {
    return <div id="root" dangerouslySetInnerHTML={{ __html: "dangerouslySetACDesigner" }}></div>
  }
}

export default connect(mapStateToProps)(requireAuthentication(Designer));