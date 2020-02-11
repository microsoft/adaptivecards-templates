import * as React from "react";
import { Container, TemplateName, ACWrapper } from "./styled";
import AdaptiveCard from '../Common/AdaptiveCard';
import { renderAdaptiveCard } from "../Common/AdaptiveCard/AdaptiveCard";

interface Props {
  toggleModal: () => void;
}

class AdaptiveCardPanel extends React.Component<Props> {
  render() {
    return (
      <Container>
        <ACWrapper>
          <AdaptiveCard />
        </ACWrapper>
        <TemplateName onClick={this.props.toggleModal}>Template Name</TemplateName>
      </Container>
    );
  }
}

export default AdaptiveCardPanel;
