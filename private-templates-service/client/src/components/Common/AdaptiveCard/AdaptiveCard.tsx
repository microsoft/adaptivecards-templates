import React from 'react';

import { Template, TemplateInstance } from 'adaptive-templating-service-typescript-node';

import * as AdaptiveCards from "adaptivecards";
import * as ACData from "adaptivecards-templating";
import markdownit from "markdown-it";

import { Card } from './styled';

interface Props {
  onClick?: () => void;
  cardtemplate: Template;
  templateVersion: string;
  hoverEffect?: boolean;
}

function renderingSetup(): AdaptiveCards.AdaptiveCard {
  AdaptiveCards.AdaptiveCard.onProcessMarkdown = function (
    text: string,
    result: { didProcess: boolean; outputHtml?: string }
  ) {
    result.outputHtml = new markdownit().render(text);
    result.didProcess = true;
  };
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
  } catch (e) {
    return new AdaptiveCards.AdaptiveCard();
  }
}

export function renderAdaptiveCard(template: Template): any {
  let adaptiveCard = parseCardTemplate(template);
  try {
    // Render the card to an HTML element
    let renderedCard = adaptiveCard.render();

    return renderedCard;
  } catch (e) {
    return <div>Error</div>;
  }
}

// bindData binds the data to the adaptive card template
function bindData(temp: TemplateInstance): TemplateInstance {
  let template: ACData.Template = new ACData.Template(temp.json);
  let context: ACData.EvaluationContext = new ACData.EvaluationContext();
  if (temp.data && temp.data[0]) {
    context.$root = temp.data[0];
  }
  try {
    let card = template.expand(context);
    return card;
  } catch (e) {
    console.log("Error parsing data: ", e);
    return temp;
  }
}

function processTemplate(temp: TemplateInstance): any {
  const jsonTemp = bindData(temp);
  const template = renderAdaptiveCard(jsonTemp);
  return template;
}

class AdaptiveCard extends React.Component<Props> {
  render() {
    let template: any = [];
    if (this.props.cardtemplate && this.props.cardtemplate.instances) {
      for (let instance of this.props.cardtemplate.instances) {
        if (instance.version === this.props.templateVersion) {
          template = processTemplate(instance);
        }
      }
      if (template.length === 0) {
        template = processTemplate(this.props.cardtemplate.instances[0]);
      }
    } else {
      return <div></div>;
    }
    return (
      <Card
        hoverEffect={this.props.hoverEffect || false}
        onClick={this.props.onClick}
        ref={n => {
          // Work around for known issue: https://github.com/gatewayapps/react-adaptivecards/issues/10
          n && n.firstChild && n.removeChild(n.firstChild);
          n && n.appendChild(template);
        }}
      />
    );
  }
}

export default AdaptiveCard;
