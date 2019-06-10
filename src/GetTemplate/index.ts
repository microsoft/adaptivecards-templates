import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as ACData from "adaptivecards-templating"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest, templateBlob: any, templatesBlob: any): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    if (context.req.url.indexOf("/playground.html") > 0) {
        context.res = {
            body: templateBlob,
            headers: { 'Content-Type': 'text/html' }
        };
        return;
    } 

    if (templateBlob) {

        let body: string;

        if (req.method === 'POST') {  // Populate the template using the POST body
            var template = new ACData.Template(templateBlob);

            var dataContext = new ACData.EvaluationContext();
            dataContext.$root = req.body;

            dataContext.registerFunction("format", (params: any[]) => {
                switch (params[1]) {
                    case ("%"):
                        return (<number>params[0] * 100).toFixed(2) + "%"

                    default:
                        return `Unknown format: ${params[1]}`
                }
            });
            dataContext.registerFunction("parseDateFromEpoch", (params: any[]) => {
                try {
                    let d = new Date(<number>params[0]);
                    let timeZoneOffset = ("0" + new Date().getTimezoneOffset() / 60).slice(-2);
                    return `${d.toISOString().substr(0, 19)}-03:00`;
                } catch {
                    return "Unable to parse epoch";
                }

            });
            body = template.expand(dataContext);
        }
        else { //  return the raw template
            body = templateBlob
        }

        if (req.query.sampleData) {
            //body["$sampleData"] = { "x": "y"}
        } else {
            delete body["$sampleData"];
        }

        context.res = {
            body: body,
            headers: { 'Content-Type': 'application/json' }
        };


    } else if (context.req.url.indexOf("/list") > 0) {
        context.res = {
            body: templatesBlob,
            headers: { 'Content-Type': 'application/json' }
        };
    } 
    else {
        context.res = {
            status: 404,
            body: "No template found for " + req.params.name
        };
    }
};

export default httpTrigger;
