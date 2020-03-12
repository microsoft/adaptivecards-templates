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
import getVersion from "../../utils/getVersion";
import {
  Template,
  PostedTemplate,
} from "adaptive-templating-service-typescript-node";
import { getDateString } from "../../utils/versionUtils";

interface Props {
  onClick?: (templateID: string) => void;
  template: Template;
}

function retrieveStateValue(template: Template): string {
  if (template.instances && template.instances[0] && template.instances[0].state) {
    let state = template.instances[0].state;
    switch (state) {
      case (PostedTemplate.StateEnum.Live): {
        return "Published";
      }
      case (PostedTemplate.StateEnum.Draft): {
        return "Draft";
      }
      case (PostedTemplate.StateEnum.Deprecated): {
        return "Deprecated";
      }
    }
  }
  // should never reach the next line
  return "";
}

class AdaptiveCardPanel extends React.Component<Props> {
  onClick = () => {
    if (this.props.onClick && this.props.template.id) {
      this.props.onClick(this.props.template.id);
    }
  };

  render() {
    let template = this.props.template;
    let version = getVersion(this.props.template);
    return (
      <Container onClick={this.onClick}>
        <ACWrapper>
          <AdaptiveCard cardtemplate={template} templateVersion={version} />
        </ACWrapper>
        <TemplateFooterWrapper>
          <TemplateNameAndDateWrapper>
            <TemplateName>{template.name}</TemplateName>
            <TemplateUpdatedAt>
              {template.updatedAt ? getDateString(template.updatedAt) : "N/A"}
            </TemplateUpdatedAt>
          </TemplateNameAndDateWrapper>
          <TemplateStateWrapper style={{ justifyContent: "center" }}>
            <StatusIndicator
              state={
                (template.instances && template.instances[0] && template.instances[0].state)
                  ?
                  template.instances[0].state
                  :
                  // should never reach the next line
                  PostedTemplate.StateEnum.Draft
              }
              style={{ marginRight: "10px" }}
            />
            <Status>{retrieveStateValue(template)}
            </Status>
          </TemplateStateWrapper>
        </TemplateFooterWrapper>
      </Container>
    );
  }
}

export default AdaptiveCardPanel;
