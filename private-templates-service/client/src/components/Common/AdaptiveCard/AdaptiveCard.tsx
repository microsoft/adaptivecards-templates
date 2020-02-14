import React from 'react';
import * as AdaptiveCards from "adaptivecards";
import { Card } from './styled';
import markdownit from "markdown-it";
import { Template, TemplateInstance } from 'adaptive-templating-service-typescript-node';

interface Props {
  toggleModal: () => void;
  cardtemplate: Template,
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

function parseCardTemplate(template: Template): AdaptiveCards.AdaptiveCard {
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

export function renderAdaptiveCard(template: Template): any {
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

/*
cleanTemplate accepts a template object. This method strips the object of the unncessary '\\\' contained in the object and removes the 
extra characters before and after the actual JSON object. It then parses the string into JSON and returns the JSON object.  
*/
function cleanTemplate(temp: TemplateInstance): Template {
  const templateString = JSON.stringify(temp.json);
  const replaceChar = templateString.replace(/\\\\\\/g, '');
  const trimTemp = replaceChar.slice(3, replaceChar.length - 3);
  const jsonTemp = JSON.parse(trimTemp);
  return jsonTemp;

}

function processTemplate(temp: TemplateInstance): any {
  const jsonTemp = cleanTemplate(temp);
  const template = renderAdaptiveCard(jsonTemp);
  return template;
}

class AdaptiveCard extends React.Component<Props> {
  render() {
    let template: any = [];
    if (this.props.cardtemplate && this.props.cardtemplate && this.props.cardtemplate.instances) {
      template = processTemplate(this.props.cardtemplate.instances[0]);
    }
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
