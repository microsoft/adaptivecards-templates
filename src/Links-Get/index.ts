// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
  linkManifestBlob: any
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  if (linkManifestBlob) {
    context.res = {
      body: linkManifestBlob,
      headers: { "Content-Type": "application/json" },
    };
  } else {
    context.res = {
      status: 404,
      body: "No link manifest found for " + req.params.domain,
    };
  }
};

export default httpTrigger;
