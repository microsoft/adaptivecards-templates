import React from 'react';

import * as AdaptiveCards from "adaptivecards";

import { Card } from './styled';
import markdownit from "markdown-it";

// interface Props {
//   template: string
// }

function getCard(): any {

  // Hard coded, will remove and connect to backend in future PR
  let card = {
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
  AdaptiveCards.AdaptiveCard.onProcessMarkdown = function (text: string, result: { didProcess: boolean, outputHtml?: string }) {
    result.outputHtml = new markdownit().render(text);
    result.didProcess = true;
  }

  let adaptiveCard = new AdaptiveCards.AdaptiveCard();
  // Set its hostConfig property unless you want to use the default Host Config
  // Host Config defines the style and behavior of a card
  adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
    fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
  });
  return adaptiveCard;
}
function parseCardTemplate(template: any): AdaptiveCards.AdaptiveCard {
  let adaptiveCard = renderingSetup();
  try {
    // Parse the card payload
    adaptiveCard.parse(template);
    return adaptiveCard;
  }
  catch (e) {
    return new AdaptiveCards.AdaptiveCard;
  }
}
export function renderAdaptiveCard(template: any): any {
  let adaptiveCard = parseCardTemplate(template);
  try {
    // Render the card to an HTML element
    let renderedCard = adaptiveCard.render();
    return renderedCard;
  }
  catch (e) {
    return <div>Error</div>;
  }
}

interface Props {
  toggleModal: () => void;
  cardtemplate: any,
}

function processTemplate(temp: any): any {
  const templateString = JSON.stringify(temp.json);
  const replaceChar = templateString.replace(/\\\\\\/g, '');
  const trimTemp = replaceChar.slice(3, replaceChar.length - 3);
  const jsonTemp = JSON.parse(trimTemp);
  const template = renderAdaptiveCard(jsonTemp);
  return template;
}

class AdaptiveCard extends React.Component<Props> {
  render() {
    const template = processTemplate(this.props.cardtemplate.instances[0]);
    return (
      <Card
        ref={n => {
          // Work around for known issue: https://github.com/gatewayapps/react-adaptivecards/issues/10
          n && n.firstChild && n.removeChild(n.firstChild);
          n && n.appendChild(template);
        }}
      />
    )
  }
}

export default AdaptiveCard;
