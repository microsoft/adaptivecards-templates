// Base class for all the StorageProviders.
import logger from '../../util/logger'
module Interface {

    export interface IUser  {
        _id?: string,
        team: string[],
        org: string[],
        email: string
    }

    export interface ITemplateInstance {
        json: string,
        version: string
    }

    export interface ITemplate {
        _id?: string,
        instances: ITemplateInstance[],
        tags: string[],
        owner: string,
        createdAt: Date,
        updatedAt: Date,
        isPublished: boolean
    }
}

module Queries {

    export interface TemplateQuery {
        templateID?: string,
        version?: string,
        tags?: string[],
        owner?: string,
        isPublished? : boolean,
        //sort based on date
        // permissions? : [enum]
    }

    export interface UserQuery {
        userID? : string,
        teamID? : string[],
        orgID? : string[],
        email?: string
    }

    // In case we need folders
    // export interface FolderQuery {
    //     folderID? : string,
    //     folderName? : string,
    //     parentID? : string,
    //     childTemplatesID?: string[],
    //     childFoldersID?: string[],
    //     // permissions? : [enum]

    // }
}


module Collections {
    export class User implements Interface.IUser {
        _id?: string;
        team: string[] = new Array();
        org: string[] = new Array();
        email: string;

        
        constructor(team: string | string[], org: string | string[], email:string, _id?: string,) {
            this.team = this.team.concat(team);
            this.org = this.org.concat(org);
            this.email = email;
            if(_id) {
                this._id = _id;
            }
        }

        static fromJSON(j: string) : Collections.User | null{
            try {
                let user: Interface.IUser = JSON.parse(j);
                return new User(user.team, user.org, user.email, user._id);
            } catch (e) {
                logger.error("Error with the JSON structure of the User object.")
                return null;
            }
        }
    }

    export class TemplateInstance implements Interface.ITemplateInstance {
        json: string;        
        version: string;
        constructor(j: string, version: string) {
            try {
                this.json = JSON.parse(j);
            } catch(e) {
                logger.error("JSON field of the template: " + j);
                throw(new Error("JSON field of the template instance can't be parsed: invalid structure or empty string:\n" + e))
            }
            this.version = version;
        }
        static fromJSON(j:string) : Collections.TemplateInstance | null {
            try {
                let instance: Interface.ITemplateInstance = JSON.parse(j);
                return new Collections.TemplateInstance(JSON.stringify(instance.json), instance.version);
            } catch(e) {
                logger.error("Error with the JSON structure of the template instance. Object can not be parsed:\n" + e)
                logger.error("Template Instance JSON: + " + j);
                return null;
            }
        }

        
    }
    
    export class Template implements Interface.ITemplate {
        _id?: string;
        instances: Collections.TemplateInstance[] = new Array()
        tags: string[] = new Array();
        owner: string;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;   
        
        
        // permission: []
        constructor(instances: Collections.TemplateInstance[] | Collections.TemplateInstance, tags: string[] | string,
                                 owner: string, createdAt: Date, 
                                 updatedAt: Date, isPublished: boolean, _id?: string) {
            this.instances = this.instances.concat(instances);
            this.tags = this.tags.concat(tags);
            this.owner = owner;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
            this.isPublished = isPublished;
            if(_id) {
                this._id = _id;
            }
        }
        static fromJSON(j: string) : Collections.Template | null {
            try {
                let template: Interface.ITemplate = JSON.parse(j);
                let templateInstances: Collections.TemplateInstance[] = new Array();
                template.instances.forEach(instance => {
                    let templateInstance: Collections.TemplateInstance | null = Collections.TemplateInstance.fromJSON(JSON.stringify(instance));
                    if(templateInstance) {
                        templateInstances.push(templateInstance);
                    } else {
                        throw(new Error("Error in parsing Templates: one or more of the instances couldn't be correctly parsed."));
                    }
                })
                return new Template(templateInstances, template.tags, template.owner,
                    new Date(template.createdAt), new Date(template.updatedAt), template.isPublished, template._id);
            } catch(e) {
                logger.error(e);
                return null;
            }
        }
    }
}

abstract class StorageProvider {
    protected connectionString: string;
    constructor(connectionString: string) {
        this.connectionString = connectionString;
    }

    abstract async getTemplate(query: Queries.TemplateQuery) : Promise<Collections.Template[]>;
    abstract async getUser(query: Queries.UserQuery) : Promise<Collections.User[]>;
    abstract async insertUser(user: Collections.User) : Promise<void>;
    abstract async insertTemplate(user: Collections.Template) : Promise<void>;

}

export {Collections, Interface, Queries, StorageProvider};


