import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as ACData from "adaptivecards-templating"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest, templateBlob: any): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    if(templateBlob) {

        let body: string;
        
        if(req.method === 'POST') {  // Populate the template using the POST body
            var template = new ACData.Template(templateBlob);

            var dataContext = new ACData.EvaluationContext();
            dataContext.$root = req.body;
            
            body = template.expand(dataContext);
        }
        else { //  return the raw template
            body = templateBlob
        }

        if(req.query.sampleData) {
            //body["$sampleData"] = { "x": "y"}
        } else {
            delete body["$sampleData"];
        }

        context.res = {
            body: body,
            headers: { 'Content-Type': 'application/json' }
        };
        
       
    } else {
        context.res = {
            status: 404,
            body: "No template found for " + req.params.name
        };
    }    
};

export default httpTrigger;
