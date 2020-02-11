// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as ACT from "adaptivecards-templating";

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  const template = req.body.template;
  if (!template) {
    context.res = {
      status: 400,
      body: "Missing 'template' in the request body"
    };
    return;
  }

  const data = req.body.data;
  if (!data) {
    context.res = {
      status: 400,
      body: "Missing 'data' in the request body"
    };
    return;
  }

  const dataContext = new ACT.EvaluationContext();
  dataContext.$root = data;

  const acTemplate = new ACT.Template(template);
  
  context.res = {
    body: acTemplate.expand(dataContext),
    headers: {
      "Content-Type": "application/json"
    }
  };
};

export default httpTrigger;