// Type definitions for adaptivecards-templating-service 1.0
// Project: https://github.com/microsoft/AdaptiveCards-templates
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
declare module 'adaptivecards-templating-service' {
    import { Router } from 'express';

    export interface ClientOptions {
        authenticationProvider : AuthenticationProvider;
    }

    export interface AuthenticationProvider {
        getOwner: () => string;
        isValid(accessToken: string) : Promise<boolean | undefined>; 
    }

    export class AzureADProvider implements AuthenticationProvider {
        constructor();
        isValid(accessToken : string) : Promise<boolean>;
        getOwner() : string;
    }

    export class TemplateServiceClient {
        static init(clientOptions : ClientOptions) : Promise<TemplateServiceClient>;
        postTemplates(template: JSON, templateId?: string, version?: string) : Promise<any>;
        getTemplates(templateId?: string, templateName?: string, version?: number) : Promise<any>;
        expressMiddleware() : Router;
    }
}