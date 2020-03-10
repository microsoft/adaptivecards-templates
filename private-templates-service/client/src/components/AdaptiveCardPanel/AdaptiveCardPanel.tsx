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
import {
  Template,
  PostedTemplate
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
    return (
      <Container onClick={this.onClick}>
        <ACWrapper>
          <AdaptiveCard cardtemplate={template} templateVersion={"1.0"} />
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
                template.isLive
                  ? PostedTemplate.StateEnum.Live
                  : PostedTemplate.StateEnum.Draft
              }
              style={{ marginRight: "10px" }}
            />
            <Status>{template.isLive ? "Published" : "Draft"}</Status>
          </TemplateStateWrapper>
        </TemplateFooterWrapper>
      </Container>
    );
  }
}

export default AdaptiveCardPanel;
