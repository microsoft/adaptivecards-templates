import React from 'react';
import * as AdaptiveCards from "adaptivecards";
import { Card } from './styled';
import markdownit from "markdown-it";
import { Template, TemplateInstance } from 'adaptive-templating-service-typescript-node';
import { getTemplateInstance } from '../../../store/currentTemplate/actions';
import { connect } from 'react-redux';
import { RootState } from '../../../store/rootReducer';

interface Props {
  onClick?: () => void;
  cardtemplate: Template;
  version?: string;
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
  let jsonTemp = {};

  try {
    jsonTemp = JSON.parse(trimTemp);
  } catch {
    console.log("Invalid Adaptive Cards JSON. Card not parsed.");
    const errorMessageJSON = JSON.stringify(require('../../../assets/default-adaptivecards/defaultErrorCard.json'));
    jsonTemp = errorMessageJSON;
  }
  return jsonTemp;
}

function processTemplate(temp: TemplateInstance): any {
  const jsonTemp = cleanTemplate(temp);
  const template = renderAdaptiveCard(jsonTemp);
  return template;
}

let isTemplateProcessed: boolean = false;
class AdaptiveCard extends React.Component<Props> {

  render() {
    console.log(this.props);
    let template: any = [];
    if (this.props.cardtemplate && this.props.cardtemplate.instances) {
      if (this.props.version) {
        for (let i = 0; i < this.props.cardtemplate.instances.length; i++) {
          if (this.props.cardtemplate.instances[i].version === this.props.version) {
            template = processTemplate(this.props.cardtemplate.instances[i]);
            break;
          }
        }
      }
      else {
        template = processTemplate(this.props.cardtemplate.instances[this.props.cardtemplate.instances.length - 1]);
      }
    }
    else {
      return (<div />);
    }
    return (
      <Card
        onClick={this.props.onClick}
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
