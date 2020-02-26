import * as React from "react";
import { Container, TemplateName, ACWrapper } from "./styled";
import AdaptiveCard from '../Common/AdaptiveCard';
import { Template } from 'adaptive-templating-service-typescript-node';

interface Props {
  onClick?: (templateID: string) => void;
  template: Template
}

class AdaptiveCardPanel extends React.Component<Props> {
  onClick = () => {
    if (this.props.onClick && this.props.template.id) {
      this.props.onClick(this.props.template.id);
    }
  }

  render() {
    let template = this.props.template;
    return (
      <Container onClick={this.onClick}>
        <ACWrapper>
          <AdaptiveCard cardtemplate={template} />
        </ACWrapper>
        <TemplateName>{template.name}</TemplateName>
      </Container>
    );
  }
}

export default AdaptiveCardPanel;
