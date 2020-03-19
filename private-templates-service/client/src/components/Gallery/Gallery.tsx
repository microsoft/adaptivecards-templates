import * as React from "react";

import { Template } from "adaptive-templating-service-typescript-node";

import AdaptiveCardPanel from "../AdaptiveCardPanel";

import { Container } from "./styled";

interface Props {
  onClick?: (templateID: string) => void;
  templates?: Array<Template>;
}

class Gallery extends React.Component<Props> {

  render() {
    let cards: JSX.Element[] = [];
    if (this.props.templates) {
      cards = this.props.templates.map(
        (val: Template, index: number) => <AdaptiveCardPanel key={index} onClick={this.props.onClick} template={val} />
      );
    }
    return (
      <Container>
        {cards}
      </Container>
    );
  }
}

export default Gallery;
