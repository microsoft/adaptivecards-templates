import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest, templateBlob: any): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    context.res = {
        body: templateBlob,
        headers: { 'Content-Type': 'application/json' }
    };
};

export default httpTrigger;
