import * as glob from "glob"
import * as fs from "fs"
import * as path from "path"

export function generate() {
    let knownSamples = [];
    try {
        let templatesDir = path.resolve(__filename, "../../../templates");
        console.log(templatesDir);
        glob.sync("**/*.json", { cwd: templatesDir, nocase: false }).map(file => {
            try {
                console.log(file);
                let contents = fs.readFileSync(path.resolve(templatesDir, file), "utf8");
                let template = JSON.parse(contents);
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

        fs.writeFileSync(path.resolve(templatesDir, "templateFields.json"), JSON.stringify(knownSamples));
    }
    catch (err) {
        console.error(err);
    }

}
