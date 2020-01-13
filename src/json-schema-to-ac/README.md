# json-schema-to-ac (json-schema-to-cardscript)

This package is a fork of the fantastic work by the West Midlands Fire Service: [json-schema-to-cardscript](https://github.com/wmfs/json-schema-to-cardscript). It follows the same concept but returns Adaptive Card elements as opposed to Cardscript-enhanced ones.


## From the forked README

[![Tymly Cardscript](https://img.shields.io/badge/tymly-cardscript-blue.svg)](https://tymly.io/)
[![CircleCI](https://circleci.com/gh/wmfs/json-schema-to-cardscript.svg?style=svg)](https://circleci.com/gh/wmfs/json-schema-to-cardscript)
[![npm (scoped)](https://img.shields.io/npm/v/@wmfs/json-schema-to-cardscript.svg)](https://www.npmjs.com/package/@wmfs/json-schema-to-cardscript) 
[![codecov](https://codecov.io/gh/wmfs/json-schema-to-cardscript/branch/master/graph/badge.svg)](https://codecov.io/gh/wmfs/json-schema-to-cardscript) 
[![CodeFactor](https://www.codefactor.io/repository/github/wmfs/json-schema-to-cardscript/badge)](https://www.codefactor.io/repository/github/wmfs/json-schema-to-cardscript) 
[![Dependabot badge](https://img.shields.io/badge/Dependabot-active-brightgreen.svg)](https://dependabot.com/) 
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) 
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) 
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/wmfs/tymly/blob/master/packages/concrete-paths/LICENSE)


> Scaffold Cardscript from a JSON-Schema schema

## <a name="install"></a>Install
```bash
$ npm install json-schema-to-cardscript --save
```

## <a name="usage"></a>Usage

```javascript
const jsonSchemaToCardscript = require('json-schema-to-cardscript')

// Given this sort of JSON Schema...
const cardscript = jsonSchemaToCardscript(
{
  "$schema": "http://json-schema.org/draft-06/schema#",
  "title": "Pizza",
  "description": "A model for storing details of a pizza (recipe, price etc.)",
  "type": "object",
  "properties": {
    "code": {
      "title": "Unique code of the pizza",
      "examples": [
        "CHEESE_TOMATO"
      ],
      "type": "string",
      "minLength": 3,
      "maxLength": 15
    },
    "label": {
      "title": "Customer-facing label",
      "examples": [
        "Cheese & Tomato"
      ],
      "type": "string"
    },
    "popularitySeq": {
      "title": "Integer value to order lists by",
      "type": "integer",
      "minimum": 1
    },
    "imageUri": {
      "title": "URI to an enticing photo of the pizza",
      "examples": [
        "https://tinyurl.com/y8r5bbu5"
      ],
      "type": "string",
      "format": "uri"
    },
    "vegetarian": {
      "title": "Is the pizza suitable for vegetarians?",
      "default": false,
      "type": "boolean"
    },
    "allergens": {
      "title": "List of allergens present in pizza",
      "examples": [
        [
          "Gluten",
          "Wheat",
          "Milk"
        ]
      ],
      "type": "array",
      "uniqueItems": true,
      "items": {
        "type": "string"
      }
    },
    "availabilityEnd": {
      "title": "Date when pizza is no longer available.",
      "examples": [
        "2019-12-31"
      ],
      "type": "string",
      "format": "date-time"
    },
    "reviews": {
      "title": "Favourable customer reviews",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "username": {
            "title": "Who wrote the review",
            "examples": [
              "joebloggs4"
            ],
            "type": "string"
          },
          "review": {
            "title": "Something nice to say",
            "examples": [
              "Lovely stuff!"
            ],
            "type": "string"
          },
          "rating": {
            "title": "Star rating (0=Awful 5=Great)",
            "default": 5,
            "examples": [
              5
            ],
            "type": "integer",
            "minimum": 0,
            "maximum": 5
          }
        },
        "required": [
          "username",
          "review",
          "rating"
        ]
      }
    }
  },
  "required": [
    "code",
    "label",
    "popularitySeq",
    "imageUri",
    "vegetarian"
  ]
},
// And some options
{
  purpose: 'editing'
}
)

// -----------------------------------------------
// Expect a half-decent stab at some Cardscript...
// -----------------------------------------------


```

## <a name="test"></a>Testing

```bash
$ npm test
```

## <a name="license"></a>License
[MIT](https://github.com/wmfs/cardscript/blob/master/LICENSE)
