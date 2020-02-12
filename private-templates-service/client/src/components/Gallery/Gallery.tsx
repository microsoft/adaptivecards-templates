import * as React from "react";
import AdaptiveCardPanel from "../AdaptiveCardPanel";
import { Container } from "./styled";

interface Props {
  toggleModal: () => void;
}

class Gallery extends React.Component<Props> {
  render() {
    return (
      <Container>
        <AdaptiveCardPanel toggleModal={this.props.toggleModal} />
      </Container>
    );
  }
}

export default Gallery;
