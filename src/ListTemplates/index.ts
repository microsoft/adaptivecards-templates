import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest, templatesBlob: any): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    context.res = {
        body: templatesBlob,
        headers: { 'Content-Type': 'application/json' }
    };
};

export default httpTrigger;
