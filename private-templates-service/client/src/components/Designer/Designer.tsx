import React, { useEffect } from 'react';
import { RootState } from '../../store/rootReducer';
import requireAuthentication from '../../utils/requireAuthentication';
import { connect } from 'react-redux';
import { editTemplate, newTemplate } from '../../store/designer/actions';
import { UserType } from '../../store/auth/types';
import { useHistory } from 'react-router-dom';
//ACDesigner
import * as monaco from 'monaco-editor';
import markdownit from 'markdown-it';
import * as ACDesigner from 'adaptivecards-designer';
//API
import { TemplateApi, NewTemplate } from 'adaptive-templating-service-typescript-node';

const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    templateID: state.designer.templateID,
    templateJSON: state.designer.templateID,
    sampleDataJSON: state.designer.sampleDataJSON
  };
};

const mapDispatchToProps = (dispatch: any) {
  return {
    newTemplate: () => {
      dispatch(newTemplate());
    },
    editTemplate: (templateID: string, templateJSON: string, sampleDataJSON: string) => {
      dispatch(editTemplate(templateID, templateJSON, sampleDataJSON));
    }
  }
}

interface DesignerProps {
  isAuthenticated: boolean;
  user?: UserType;
  templateID: string;
  templateJSON: string;
  sampleDataJSON: string;
}

const Designer = (props: DesignerProps) => {

  useEffect(() => {
    const element = document.getElementById("designer-container");
    if (element) {
      designer.attachTo(element);
    }

    designer.monacoModuleLoaded(monaco);

    getCardData(designer);
  }, [])

  let history = useHistory();
  let api = new TemplateApi();
  let bearer_auth = api.setApiKey(0, "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSJ9.eyJhdWQiOiI4NjMxY2E0ZS1hMjVkLTQ5YWUtYmQ5OC1mZjNlMWRkZDQ0MTgiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE1ODEzNjA2MTgsIm5iZiI6MTU4MTM2MDYxOCwiZXhwIjoxNTgxMzY0NTE4LCJhaW8iOiI0Mk5nWUdDVzk3Qm1NamRrY3pQK1pLSGZMeFlPQUE9PSIsImF6cCI6Ijg2MzFjYTRlLWEyNWQtNDlhZS1iZDk4LWZmM2UxZGRkNDQxOCIsImF6cGFjciI6IjEiLCJvaWQiOiI4YWRiZWRhNi00ZDdkLTQ1N2ItOTNkZC1jMTVmMWE1Y2NiMzEiLCJzdWIiOiI4YWRiZWRhNi00ZDdkLTQ1N2ItOTNkZC1jMTVmMWE1Y2NiMzEiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1dGkiOiJ6SDlkcHVQNnprcUJidC1MUnVGYkFBIiwidmVyIjoiMi4wIn0.WhdvkqeJymW-Ayeht6tafd8Z1muoMnyPhKoYq6KGrHdv6psfYQtmK0P0-TA5_zgOOHNNJvpVqH2LPnZTbpK4qgKLByR9umELHgD2FW9v5Djg1NAKqmQEGg_-Th__SGE3L9_WI58Wh0_Toh3f7fpLDzNBiC5iYDdGSaTilwxaYMGbXnJO2Y6Tow83GQATKGA3B27Xz2iBO9UFmEy9rte4DyLUAEIE6SCKwg-3YuD0zKfpgyd-lvhZZr37HeE9Y6hyOm_M4b_jwWI7oK0uZASuQer83W5jsSZNtiXg_T0euXJcvI9lL6R4oJDI_N6Y42RdDioIwX6FzOA4vRzTySZjBw");
  let callback = function (error: any, data: any, response: any) {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully. Returned data: ' + data);
    }
  };

  ACDesigner.GlobalSettings.enableDataBindingSupport = true;
  ACDesigner.GlobalSettings.showSampleDataEditorToolbox = true;

  ACDesigner.CardDesigner.onProcessMarkdown = (text: string, result: { didProcess: boolean, outputHtml?: string }) => {
    result.outputHtml = new markdownit().render(text);
    result.didProcess = true;
  }

  let designer = initDesigner();

  let closeButton = new ACDesigner.ToolbarButton("closeButton", "Close", "", (sender) => (history.goBack()));
  closeButton.separator = true;
  designer.toolbar.insertElementAfter(closeButton, ACDesigner.CardDesigner.ToolbarCommands.TogglePreview);

  let saveButton = new ACDesigner.ToolbarButton("saveButton", "Save", "", (sender) => (saveFunction(designer, api)));
  saveButton.separator = true;
  designer.toolbar.insertElementAfter(saveButton, ACDesigner.CardDesigner.ToolbarCommands.TogglePreview);

  const element = document.getElementById("root");
  if (element) {
    designer.attachTo(element);
  }

  designer.monacoModuleLoaded(monaco);

  getCardData(designer);

  return <div id="designer-container" dangerouslySetInnerHTML={{ __html: "dangerouslySetACDesigner" }}></div>;
}

function saveFunction(designer: ACDesigner.CardDesigner, props: DesignerProps, api: TemplateApi): void {
  let newTemplate = new NewTemplate();
  newTemplate.template = JSON.stringify(designer.getCard());
  newTemplate.isPublished = false;
  let sampleDataJSON: string = JSON.stringify(designer.sampleData);
  if (props.templateID != "") {
    api.templateTemplateIdPost(props.templateID, newTemplate);
    editTemplate(props.templateID, newTemplate.template, sampleDataJSON)
  }
  else {
    const newTemplateID = api.templatePost(newTemplate);
    editTemplate(newTemplateID, newTemplate.template, sampleDataJSON);
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

function getCardData(designer: ACDesigner.CardDesigner): void {
  //Example of how to export data from designer
  console.log("Adaptive Card Template: " + designer.getCard());
  console.log("Adaptive Card Sample Data: " + designer.sampleData);
}

export default connect(mapStateToProps, mapDispatchToProps)(requireAuthentication(Designer));
