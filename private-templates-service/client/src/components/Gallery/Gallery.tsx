import * as React from "react";
import AdaptiveCard from "../AdaptiveCard";
import { Container } from "./styled";

class Gallery extends React.Component {
  render() {
    return (
      <Container>
        <AdaptiveCard />
        <AdaptiveCard />
        <AdaptiveCard />
      </Container>
    );
  }
}

export default Gallery;
