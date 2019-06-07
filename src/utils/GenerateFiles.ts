import * as glob from "glob"
import * as fs from "fs"
import * as path from "path"

export class Utils {

    public static generate() {
        let knownSamples = [];

        glob.sync("../templates/**/*.json", { nocase: false }).map(file => {
            try {
                let contents = fs.readFileSync(file, "utf8");
                let template = JSON.parse(contents);
                if (template["$sampleData"]) {
                    let properties = Object.getOwnPropertyNames(template["$sampleData"]);
                    knownSamples.push({
                        "templatePath": path.relative("../templates", file).replace("\\", "/"),
                        "properties": properties
                    })
                } else {
                    console.log(`No sample data for ${file}`);
                }
            } catch (ex) {
                console.log(`Failed to read file ${file}`);
            }

        });

        fs.writeFileSync("../templates/templateFields.json", JSON.stringify(knownSamples));
    }
}