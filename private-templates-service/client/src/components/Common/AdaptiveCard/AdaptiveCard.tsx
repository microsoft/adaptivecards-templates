import React from 'react';

import * as AdaptiveCards from "adaptivecards";

import { Card } from './styled';
import markdownit from "markdown-it";

function getCard(): any {
  // Hard coded, will remove and connect to backend in future PR
  let card = {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.0",
    "body": [
        {
            "type": "TextBlock",
            "text": "Your registration is almost complete",
            "size": "medium",
            "weight": "bolder"
        },
        {
            "type": "TextBlock",
            "text": "What type of food do you prefer?",
            "wrap": true
        },
        {
            "type": "ImageSet",
            "imageSize": "medium",
            "images": [
                {
                    "type": "Image",
                    "url": "https://contososcubademo.azurewebsites.net/assets/steak.jpg"
                },
                {
                    "type": "Image",
                    "url": "https://contososcubademo.azurewebsites.net/assets/chicken.jpg"
                },
                {
                    "type": "Image",
                    "url": "https://contososcubademo.azurewebsites.net/assets/tofu.jpg"
                }
            ]
        }
    ],
    "actions": [
        {
            "type": "Action.ShowCard",
            "title": "Steak",
            "card": {
                "type": "AdaptiveCard",
                "body": [
                    {
                        "type": "TextBlock",
                        "text": "How would you like your steak prepared?",
                        "size": "medium",
                        "wrap": true
                    },
                    {
                        "type": "Input.ChoiceSet",
                        "id": "SteakTemp",
                        "style": "expanded",
                        "choices": [
                            {
                                "title": "Rare",
                                "value": "rare"
                            },
                            {
                                "title": "Medium-Rare",
                                "value": "medium-rare"
                            },
                            {
                                "title": "Well-done",
                                "value": "well-done"
                            }
                        ]
                    },
                    {
                        "type": "Input.Text",
                        "id": "SteakOther",
                        "isMultiline": true,
                        "placeholder": "Any other preparation requests?"
                    }
                ],
                "actions": [
                    {
                        "type": "Action.Submit",
                        "title": "OK",
                        "data": {
                            "FoodChoice": "Steak"
                        }
                    }
                ]
            }
        },
        {
            "type": "Action.ShowCard",
            "title": "Chicken",
            "card": {
                "type": "AdaptiveCard",
                "body": [
                    {
                        "type": "TextBlock",
                        "text": "Do you have any allergies?",
                        "size": "medium",
                        "wrap": true
                    },
                    {
                        "type": "Input.ChoiceSet",
                        "id": "ChickenAllergy",
                        "style": "expanded",
                        "isMultiSelect": true,
                        "choices": [
                            {
                                "title": "I'm allergic to peanuts",
                                "value": "peanut"
                            }
                        ]
                    },
                    {
                        "type": "Input.Text",
                        "id": "ChickenOther",
                        "isMultiline": true,
                        "placeholder": "Any other preparation requests?"
                    }
                ],
                "actions": [
                    {
                        "type": "Action.Submit",
                        "title": "OK",
                        "data": {
                            "FoodChoice": "Chicken"
                        }
                    }
                ]
            }
        },
        {
            "type": "Action.ShowCard",
            "title": "Tofu",
            "card": {
                "type": "AdaptiveCard",
                "body": [
                    {
                        "type": "TextBlock",
                        "text": "Would you like it prepared vegan?",
                        "size": "medium",
                        "wrap": true
                    },
                    {
                        "type": "Input.Toggle",
                        "id": "Vegetarian",
                        "title": "Please prepare it vegan",
                        "valueOn": "vegan",
                        "valueOff": "notVegan"
                    },
                    {
                        "type": "Input.Text",
                        "id": "VegOther",
                        "isMultiline": true,
                        "placeholder": "Any other preparation requests?"
                    }
                ],
                "actions": [
                    {
                        "type": "Action.Submit",
                        "title": "OK",
                        "data": {
                            "FoodChoice": "Vegetarian"
                        }
                    }
                ]
            }
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
function parseCardTemplate(): AdaptiveCards.AdaptiveCard {
  let adaptiveCard = renderingSetup();
  try {
    let cardTemplate = getCard();
    // Parse the card payload
    adaptiveCard.parse(cardTemplate);
    return adaptiveCard;
  }
  catch (e) {
    return new AdaptiveCards.AdaptiveCard;
  }
}
export function renderAdaptiveCard(): any {
  let adaptiveCard = parseCardTemplate();
  try {
    // Render the card to an HTML element
    let renderedCard = adaptiveCard.render();
    return renderedCard;
  }
  catch (e) {
    return <div>Error</div>;
  }
}


class AdaptiveCard extends React.Component {
  render() {
    return (
      <Card
        ref={n => {
          // Work around for known issue: https://github.com/gatewayapps/react-adaptivecards/issues/10
          n && n.firstChild && n.removeChild(n.firstChild);
          n && n.appendChild(renderAdaptiveCard());
        }}
      />
    )
  }
}

export default AdaptiveCard;
