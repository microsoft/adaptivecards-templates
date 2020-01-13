// TODO: Probably going to be called Input.CardList ?
const makeEmptySchema = require('../utils/make-empty-schema')
const makeBaseElement = require('../utils/make-base-element')
const addDescriptions = require('../utils/add-descriptions')
const _ = require('lodash')
_.mixin(require('lodash-inflection'))

module.exports = function cardListElementGenerator (key, config, options) {
  const elements = []
  const cardListElement = makeBaseElement(key, 'CardList', config)

  cardListElement.editable = true
  cardListElement.addButtonLabel = `Add ${_.singularize(key)}`
  addDescriptions(cardListElement, config)

  const card = makeEmptySchema()
  // TODO: Probably better ways, but get the first two string/integer values for title/subtitle?
  let labelTemplates = []
  for (const [key, value] of Object.entries(config.properties)) {
    if (labelTemplates.length < 2) {
      if (value.type === 'string' || value.type === 'integer') {
        labelTemplates.push(`{{item.${key}}}`)
      }
    }
  }
  if (labelTemplates.length === 0) {
    labelTemplates.push('{{item.id}')
  }
  if (labelTemplates.length === 1) {
    labelTemplates.push('Need a description!')
  }

  cardListElement.instanceTitleTemplate = labelTemplates[0]
  cardListElement.instanceSubtitleTemplate = labelTemplates[1]

  cardListElement.card = card

  if (config.showWhen) {
    cardListElement.showWhen = config.showWhen
  }

  elements.push(cardListElement)
  return elements
}

/*
{
  "id": "starters",
  "type": "CardList",
  "editable": true,
  "addButtonLabel": "Add a starter!",
  "instanceTitleTemplate": "{{ item.starterType | replaceWithTitle(lists.$simpleTitleMaps.starterType)}}",
  "instanceSubtitleTemplate": "You'll be wanting {{item.starterQuantity}} of these.",
  "card": {
  "type": "AdaptiveCard",
    "version": "1.0",
    "body": [
    {
      "type": "TextBlock",
      "text": "Starter"
    },
    {
      "id": "starterType",
      "type": "Input.ChoiceSet",
      "spacing": "medium",
      "choices": [
        {
          "value": "WEDGES",
          "title": "Wedges"
        },
        {
          "value": "CHICKEN_WINGS",
          "title": "Chicken Wings"
        }
      ]
    },
    {
      "id": "starterQuantity",
      "type": "Input.Number",
      "spacing": "medium",
      "placeholder": "Quantity",
      "value": 2
    }
  ]
}
}
*/
