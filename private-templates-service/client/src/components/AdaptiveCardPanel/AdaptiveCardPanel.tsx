import * as React from "react";
import { Container, TemplateName, ACWrapper } from "./styled";
import AdaptiveCard from '../Common/AdaptiveCard';
import { Template } from 'adaptive-templating-service-typescript-node';

interface Props {
  toggleModal: () => void;
  template: Template
}

class AdaptiveCardPanel extends React.Component<Props> {
  render() {
    let temp = this.props.template;
    return (
      <Container>
        <ACWrapper>
          <AdaptiveCard toggleModal={this.props.toggleModal} cardtemplate={temp} />
        </ACWrapper>
        <TemplateName onClick={this.props.toggleModal}>{temp.name}</TemplateName>
      </Container>
    );
  }
}

export default AdaptiveCardPanel;
