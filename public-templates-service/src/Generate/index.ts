// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as jsonSchemaToAc from "../json-schema-to-ac";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {


  const schema = req.body ? req.body : {
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
  };

  
  const card = jsonSchemaToAc(schema, {
    purpose: req.params.purpose || "editing"
  });

  context.res = {
    body: card,
    headers: {
      "Content-Type": "application/json"
    }
  };
};

export default httpTrigger;
