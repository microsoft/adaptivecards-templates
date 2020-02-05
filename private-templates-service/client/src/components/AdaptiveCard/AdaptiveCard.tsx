import * as React from "react";
import * as AdaptiveCards from "adaptivecards";
import { Card, Container, TemplateName } from "../AdaptiveCard/styled";

function getCard(): any {
  // Hard coded, will remove and connect to backend in future PR
  var card = {
    type: "AdaptiveCard",
    version: "1.0",
    body: [
      {
        type: "Image",
        url: "http://adaptivecards.io/content/adaptive-card-50.png"
      },
      {
        type: "TextBlock",
        text: "Hello **Adaptive Cards!**"
      }
    ],
    actions: [
      {
        type: "Action.OpenUrl",
        title: "Learn more",
        url: "http://adaptivecards.io"
      },
      {
        type: "Action.OpenUrl",
        title: "GitHub",
        url: "http://github.com/Microsoft/AdaptiveCards"
      }
    ]
  };
  return card;
}

function renderingSetup(): AdaptiveCards.AdaptiveCard {
  let adaptiveCard = new AdaptiveCards.AdaptiveCard();
  // Set its hostConfig property unless you want to use the default Host Config
  // Host Config defines the style and behavior of a card
  adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
    fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
  });
  return adaptiveCard
}

function parseCardTemplate(): AdaptiveCards.AdaptiveCard {
  let adaptiveCard = renderingSetup();
  try {
    var cardTemplate = getCard();
    // Parse the card payload
    adaptiveCard.parse(cardTemplate);
    return adaptiveCard;
  }
  catch (e) {
    return new AdaptiveCards.AdaptiveCard;
  }
}

function renderAdaptiveCard(): any {
  let adaptiveCard = parseCardTemplate();
  try {
    // Render the card to an HTML element
    let renderedCard = adaptiveCard.render();
    return renderedCard;
  }
  catch (e) {
    return <div>Error</div>
  }
}

class AdaptiveCard extends React.Component {
  render() {
    return (
      <Container>
        <Card
          ref={n => {
            // Work around for known issue: https://github.com/gatewayapps/react-adaptivecards/issues/10
            n && n.firstChild && n.removeChild(n.firstChild);
            n && n.appendChild(renderAdaptiveCard());
          }}
        />
        <TemplateName>Template Name</TemplateName>
      </Container>
    );
  }
}

export default AdaptiveCard;
