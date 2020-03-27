import * as React from "react";

import { RootState } from "../../store/rootReducer";
import { connect } from "react-redux";

import {
  Container,
  TemplateName,
  ACWrapper,
  TemplateFooterWrapper,
  TemplateStateWrapper,
  TemplateNameAndDateWrapper,
  TemplateUpdatedAt
} from "./styled";
import {
  StatusIndicator,
  Status
} from "../Dashboard/PreviewModal/TemplateInfo/styled";

import AdaptiveCard from "../Common/AdaptiveCard";

import {
  Template,
  PostedTemplate,
} from "adaptive-templating-service-typescript-node";

import { getLatestVersion, getLatestTemplateInstanceState } from "../../utils/TemplateUtil";
import { getDateString } from "../../utils/versionUtils";
import KeyCode from "../../globalKeyCodes";

interface Props {
  onClick?: (templateID: string) => void;
  template: Template;
  pageTitle?: string;
}

const mapStateToProps = (state: RootState) => {
  return {
    pageTitle: state.page.currentPage
  };
};

class AdaptiveCardPanel extends React.Component<Props> {
  onKeyDown = (event: any) => {
    if (this.props.onClick && this.props.template.id && event.keyCode === KeyCode.ENTER) {
      this.props.onClick(this.props.template.id);
    }
  }

  render() {
    let template = this.props.template;
    let version = getLatestVersion(this.props.template);
    let state = getLatestTemplateInstanceState(template)
    return (
      <Container tabIndex={this.props.pageTitle && this.props.pageTitle.toLowerCase() === "dashboard" ? 0 : -1} onKeyDown={this.props.pageTitle && this.props.pageTitle.toLowerCase() === "dashboard" ? this.onKeyDown : () => { }}>
        <ACWrapper>
          <AdaptiveCard cardtemplate={template} templateVersion={version} hoverEffect />
        </ACWrapper>
        <TemplateFooterWrapper>
          <TemplateNameAndDateWrapper>
            <TemplateName>{template.name}</TemplateName>
            <TemplateUpdatedAt>
              {template.updatedAt ? getDateString(template.updatedAt) : "N/A"}
            </TemplateUpdatedAt>
          </TemplateNameAndDateWrapper>
          <TemplateStateWrapper style={{ justifyContent: "center" }}>
            <StatusIndicator state={template.instances && template.instances[0] && template.instances[0].state ? template.instances[0].state : PostedTemplate.StateEnum.Draft}
              style={{ marginRight: "10px" }}
            />
            <Status>{state}
            </Status>
          </TemplateStateWrapper>
        </TemplateFooterWrapper>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(AdaptiveCardPanel);
