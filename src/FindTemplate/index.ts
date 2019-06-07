import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest, templateFieldsBlob: any): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    
    let templates = JSON.parse(templateFieldsBlob);

    let dataProperties = Object.getOwnPropertyNames(req.body);
    let final = [];
    for(let template of templates) {
        let match = {
            file: template.file,
            propMatchCount: 0
        };

        for(let dataProp of dataProperties) { 
            for(let templateProp of template.properties) {
                if(dataProp === templateProp) {
                    match.propMatchCount++;
                }
            }
        }

        if(match.propMatchCount > 0) 
            final.push(match);
    }

    // sort descending
    final.sort((a, b) => b.propMatchCount - a.propMatchCount);

    context.res = {
        body: final,
        headers: {
            "Content-Type": "application/json"
        }
    };

};

export default httpTrigger;
