// Type definitions for adaptivecards-templating-service 1.0
// Project: https://github.com/microsoft/AdaptiveCards-templates
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
declare module 'adaptivecards-templating-service' {
    import { Router } from 'express';

    export interface IUser {
        id?: string;
        authId: string,
        issuer: string;
        team?: string[];
        org?: string[];
      }

    export interface ITemplateInstance {
        json: string;
        version: string;
    }
    
    export interface ITemplate {
        id?: string;
        instances: ITemplateInstance[];
        tags: string[];
        owner: string;
        createdAt?: Date;
        updatedAt?: Date;
        isPublished?: boolean;
    }
    
    export interface JSONResponse<T> {
        success: boolean;
        errorMessage?: string;
        result?: T;
    }    

    export interface ClientOptions {
        authenticationProvider : AuthenticationProvider;
        storageProvider: StorageProvider,
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

    export class InMemoryDBProvider implements StorageProvider {
        constructor();
        getUser(query: Partial<IUser>): Promise<JSONResponse<IUser[]>>;
        getTemplate(query: Partial<ITemplate>): Promise<JSONResponse<ITemplate[]>>;
        updateUser(query: Partial<IUser>, updateQuery: Partial<IUser>): Promise<JSONResponse<Number>>;
        updateTemplate(query: Partial<ITemplate>, updateQuery: Partial<ITemplate>): Promise<JSONResponse<Number>>;
        insertUser(user: IUser): Promise<JSONResponse<string>>;
        insertTemplate(template: ITemplate): Promise<JSONResponse<string>>;
        removeUser(query: Partial<IUser>): Promise<JSONResponse<Number>>;
        removeTemplate(query: Partial<ITemplate>): Promise<JSONResponse<Number>>;
    }

    export interface StorageProvider {
        getUser(query: Partial<IUser>): Promise<JSONResponse<IUser[]>>;
        getTemplate(query: Partial<ITemplate>): Promise<JSONResponse<ITemplate[]>>;
        updateUser(query: Partial<IUser>, updateQuery: Partial<IUser>): Promise<JSONResponse<Number>>;
        updateTemplate(query: Partial<ITemplate>, updateQuery: Partial<ITemplate>): Promise<JSONResponse<Number>>;
        insertUser(user: IUser): Promise<JSONResponse<string>>;
        insertTemplate(template: ITemplate): Promise<JSONResponse<string>>;
        removeUser(query: Partial<IUser>): Promise<JSONResponse<Number>>;
        removeTemplate(query: Partial<ITemplate>): Promise<JSONResponse<Number>>;
      }

    export class TemplateServiceClient {
        static init(clientOptions : ClientOptions): TemplateServiceClient;
        postTemplates(template: JSON, templateId?: string, version?: string): Promise<any>;
        getTemplates(templateId?: string, templateName?: string, version?: number): Promise<any>;
        expressMiddleware(): Router;
        userExpressMiddleware(): Router;
        removeUser(): Promise<JSONResponse<Number>>;
    }
}
