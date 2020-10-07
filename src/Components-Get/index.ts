// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
  componentBlob: any
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  if (componentBlob) {
    context.res = {
      body: componentBlob,
      headers: { "Content-Type": "application/json" },
    };
  } else {
    context.res = {
      status: 404,
      body: "No component found for " + req.params.name,
    };
  }
};

export default httpTrigger;
