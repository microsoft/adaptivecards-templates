import * as React from "react";
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
import { getLatestVersion, getLatestTemplateInstanceState } from "../../utils/TemplateUtil";
import {
  Template,
  PostedTemplate,
} from "adaptive-templating-service-typescript-node";
import { getDateString } from "../../utils/versionUtils";

interface Props {
  onClick?: (templateID: string) => void;
  template: Template;
}

class AdaptiveCardPanel extends React.Component<Props> {
  onClick = () => {
    if (this.props.onClick && this.props.template.id) {
      this.props.onClick(this.props.template.id);
    }
  };

  render() {
    let template = this.props.template;
    let version = getLatestVersion(this.props.template);
    let state = getLatestTemplateInstanceState(template)
    return (
      <Container onClick={this.onClick}>
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

export default AdaptiveCardPanel;
