import React from 'react';
import * as AdaptiveCards from "adaptivecards";
import * as ACData from "adaptivecards-templating";
import { Card } from './styled';
import markdownit from "markdown-it";
import { Template, TemplateInstance } from 'adaptive-templating-service-typescript-node';

interface Props {
  onClick?: () => void;
  cardtemplate: Template,
  templateVersion: string,
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

function setContextRoot(data: string, context: ACData.EvaluationContext) {
  console.log(data);
  try {
    let dataString = JSON.stringify(data);
    let dataJSON: JSON = JSON.parse(dataString);
    context.$root = dataJSON;
  }
  catch (e) {
    console.log(e);
  }
}

// bindData binds the data to the adaptive card template
function bindData(temp: TemplateInstance): TemplateInstance {
  let jsonTemp = cleanTemplate(temp);
  let template: ACData.Template = new ACData.Template(jsonTemp);
  let context: ACData.EvaluationContext = new ACData.EvaluationContext()
  if (temp.data && temp.data[0]) {
    setContextRoot(temp.data[0], context);
  }
  let card = template.expand(context);
  return card;
}

/*
cleanTemplate accepts a template object. This method strips the object of the unncessary '\\\' contained in the object and removes the 
extra characters before and after the actual JSON object. It then parses the string into JSON and returns the JSON object.  
*/
function cleanTemplate(temp: TemplateInstance): Template {
  const json = JSON.stringify(temp.json);
  let jsonTemp = {};

  try {
    jsonTemp = JSON.parse(json);
  } catch {
    console.log("Invalid Adaptive Cards JSON. Card not parsed.");
    const errorMessageJSON = JSON.stringify(require('../../../assets/default-adaptivecards/defaultErrorCard.json'));

    jsonTemp = errorMessageJSON;
  }
  return jsonTemp;
}

function processTemplate(temp: TemplateInstance): any {
  const jsonTemp = bindData(temp);
  const template = renderAdaptiveCard(jsonTemp);
  return template;
}

class AdaptiveCard extends React.Component<Props> {
  render() {
    let template: any = [];
    if (this.props.cardtemplate && this.props.cardtemplate && this.props.cardtemplate.instances) {
      for (let instance of this.props.cardtemplate.instances) {
        if (instance.version === this.props.templateVersion){
          template = processTemplate(instance);
        }
      }
      if (template.length === 0) { 
        template = processTemplate(this.props.cardtemplate.instances[0]);
      }
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
