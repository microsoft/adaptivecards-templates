import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest, templateFieldsBlob: any): Promise<void> {

    let dataProperties = Object.getOwnPropertyNames(req.body);
    let final = [];
    for (let template of templateFieldsBlob) {
        let match = {
            templateUrl: template.templatePath,
            propMatchCount: 0,
            confidence: 0.0
        };

        for (let dataProp of dataProperties) {
            for (let templateProp of template.properties) {
                if (dataProp === templateProp) {
                    match.propMatchCount++;
                }
            }
        }

        if (match.propMatchCount > 0) {
            match.confidence = match.propMatchCount / dataProperties.length;
            delete match.propMatchCount;
            final.push(match);
        }
    }

    // sort descending
    final = final.sort((a, b) => b.confidence - a.confidence);

    context.res = {
        body: final,
        headers: {
            "Content-Type": "application/json"
        }
    };

};

export default httpTrigger;
