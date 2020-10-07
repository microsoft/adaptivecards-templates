// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as ACData from "adaptivecards-templating";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
  templateBlob: any,
  templatesBlob: any
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  if (context.req.url.indexOf("/playground.html") > 0) {
    context.res = {
      body: templateBlob,
      headers: { "Content-Type": "text/html" },
    };
    return;
  }

  if (templateBlob) {
    let body: string;

    if (req.method === "POST") {
      // Populate the template using the POST body
      var template = new ACData.Template(templateBlob);
      body = template.expand({
        $root: req.body,
      });
    } else {
      //  return the raw template
      body = templateBlob;
    }

    if (req.query.sampleData === "true") {
    } else {
      delete body["$sampleData"];
    }

    // Remove the odata.type as it's only used for template lookup
    delete body["@odata.type"];

    context.res = {
      body: body,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } else if (context.req.url.indexOf("/list") > 0) {
    if (req.query.flat === "true") {
      let groupedTemplates = Object.getOwnPropertyNames(templatesBlob).map(
        (propName) => templatesBlob[propName].templates
      );

      let flat = [];
      for (let grp of groupedTemplates)
        for (let template of grp) flat.push(template.fullPath);

      context.res = {
        body: flat,
        headers: { "Content-Type": "application/json" },
      };
    } else {
      context.res = {
        body: templatesBlob,
        headers: { "Content-Type": "application/json" },
      };
    }
  } else {
    context.res = {
      status: 404,
      body: "No template found for " + req.params.name,
    };
  }
};

export default httpTrigger;
