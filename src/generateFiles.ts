// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as glob from "glob";
import * as fs from "fs";
import * as path from "path";

function generateTemplates() {
  const knownSamples = [];
  const knownTemplates = {};

  let templatesDir = path.resolve(__filename, "../../../templates");
  glob.sync("**/*/*.json", { cwd: templatesDir, nocase: false }).map((file) => {
    try {
      const fileContent = fs.readFileSync(
        path.resolve(templatesDir, file),
        "utf8"
      );
      const dirName = path.dirname(file);
      const template = JSON.parse(fileContent);
      if (!knownTemplates[dirName]) {
        knownTemplates[dirName] = {
          templates: [],
        };
      }

      knownTemplates[dirName].templates.push({
        file: path.basename(file),
        fullPath: file,
      });

      let knownSample = {
        templatePath: file,
        properties: undefined,
        typeKey: undefined,
        typeValue: undefined,
      };

      if (template["@odata.type"]) {
        knownSample.typeKey = "@odata.type";
        knownSample.typeValue = template["@odata.type"];
      }

      if (template["$sampleData"]) {
        knownSample.properties = Object.getOwnPropertyNames(
          template["$sampleData"]
        );
      }

      if (knownSample.properties || knownSample.typeValue) {
        knownSamples.push(knownSample);
      }
    } catch (ex) {
      console.log(`Failed to read file ${file}`);
    }
  });

  try {
    fs.writeFileSync(
      path.resolve(templatesDir, "templates.json"),
      JSON.stringify(knownTemplates)
    );
    fs.writeFileSync(
      path.resolve(templatesDir, "templateFields.json"),
      JSON.stringify(knownSamples)
    );
  } catch (err) {
    console.error(err);
  }
}

function generateComponents() {
  const knownComponents = {};

  let componentsDir = path.resolve(__filename, "../../../components");
  glob
    .sync("**/*/*.json", { cwd: componentsDir, nocase: false })
    .map((file) => {
      try {
        const fileContent = fs.readFileSync(
          path.resolve(componentsDir, file),
          "utf8"
        );
        const component = JSON.parse(fileContent);

        const componentDomain = path.dirname(file);
        if (!knownComponents[componentDomain]) {
          knownComponents[componentDomain] = {
            components: [],
          };
        }

        knownComponents[componentDomain].components.push({
          name: component.name,
        });

      } catch (ex) {
        console.log(`Failed to read file ${file}`);
      }
    });

  try {
    fs.writeFileSync(
      path.resolve(componentsDir, "components.json"),
      JSON.stringify(knownComponents)
    );
  } catch (err) {
    console.error(err);
  }
}

export function generate() {
  generateTemplates();
  generateComponents();
}
