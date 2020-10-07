// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
  componentsBlob: any
): Promise<void> {
  let results: any[];
  let flatList = [];

  // Flatten the list of components
  let grouped = Object.getOwnPropertyNames(componentsBlob).map(
    (componentDomain) => componentsBlob[componentDomain].components
  );

  for (let grp of grouped) for (let component of grp) flatList.push(component);

  if (req.query.name) {
    results = flatList.filter((c) => c.name === req.query.name);
  } else {
    results = flatList.slice(0, 10);
  }

  context.res = {
    body: results,
    headers: {
      "Content-Type": "application/json",
    },
  };
};

export default httpTrigger;
