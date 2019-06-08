import * as glob from "glob"
import * as fs from "fs"
import * as path from "path"

export function generate() {


    const knownSamples = [];
    const knownTemplates = {};
    const test =
    {
        "schema.org": {
            "templates": [
                {
                    "file": "Restaunt.json",
                    "fullPath": "schema.org/Restaurant.json"
                }
            ]
        }
    }

    try {
        let templatesDir = path.resolve(__filename, "../../../templates");
        glob.sync("**/*/*.json", { cwd: templatesDir, nocase: false }).map(file => {
            try {
                const contents = fs.readFileSync(path.resolve(templatesDir, file), "utf8");
                const dirName = path.dirname(file);
                const template = JSON.parse(contents);
                if (!knownTemplates[dirName]) {
                    knownTemplates[dirName] = {
                        templates: []
                    };
                }

                knownTemplates[dirName].templates.push({
                    file: path.basename(file),
                    fullPath: file
                });

                if (template["$sampleData"]) {
                    let properties = Object.getOwnPropertyNames(template["$sampleData"]);
                    knownSamples.push({
                        "templatePath": file,
                        "properties": properties
                    })
                } else {
                    console.log(`No sample data for ${file}`);
                }
            } catch (ex) {
                console.log(`Failed to read file ${file}`);
            }

        });

        fs.writeFileSync(path.resolve(templatesDir, "templates.json"), JSON.stringify(knownTemplates));
        fs.writeFileSync(path.resolve(templatesDir, "templateFields.json"), JSON.stringify(knownSamples));
    }
    catch (err) {
        console.error(err);
    }

}
