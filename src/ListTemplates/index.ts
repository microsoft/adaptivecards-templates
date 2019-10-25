// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest, templatesBlob: any): Promise<void> {
    // THIS IS NOT WORKING RIGHT NOW..... SEE GetTemplate/index.ts 
    context.log('HTTP trigger function processed a request.');
    context.res = {
        body: templatesBlob,
        headers: { 'Content-Type': 'application/json' }
    };
};

export default httpTrigger;
