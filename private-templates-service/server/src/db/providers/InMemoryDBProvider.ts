import {Queries, Collections, StorageProvider, Interface} from './StorageProvider'
import {promises as fs} from 'fs'
import path from 'path'
import { sprintf } from 'sprintf-js'
import logger from '../../util/logger'



const dbFilePath = path.join(__dirname);
const MAX_TRY_COUNT = 5;  //  Maximum numebr of attempts in case of failure
const usersPath: string = path.join(dbFilePath, 'users.json');
const templatesPath: string = path.join(dbFilePath, 'templates.json');
const options = {
    encoding: 'utf8'
}; 
const SUCCES_WRITE_MESSAGE: string = "Succesfully written to %s DB";
const SUCCES_IMPORT_MESSAGE: string = "Succesfully imported from %s DB";
const USER_COLLECTION_NAME: string = "User";
const TEMPLATE_COLLECTION_NAME: string = "Template";


// uuidv4
function generateUniqueID() : string{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
  }

export class InMemoryDBProvider extends StorageProvider {

    users: Map<string, Collections.User> = new Map();
    templates: Map<string, Collections.Template> = new Map();
    readTryCount: number = 0;
    writeTryCount: number = 0;
    
    constructor() {
        super("");
    }


    private async _insert<T extends Collections.Template | Collections.User>(doc: T,
                                                                             collection: Map<String, T>,
                                                                             commitFunction?:() => Promise<void>,
                                                                             ifCommit: boolean = true, )
                                                                             : Promise<void> {
        this._checkID(doc);
        if (!collection.has(doc._id!)) {
            collection.set(doc._id!, doc);
            if(ifCommit && commitFunction) {
                commitFunction();
            }
        } else {
            logger.error("Object with id: " + doc._id + " already exists. Insertion failed");
        }
    }

    private async _writeData(path: string, data: string, successMessage: string, options: Object) : Promise<void> {
        return fs.writeFile(path, data, options)
        .then(result => console.log(successMessage))
        .catch(err => {
            if(this.writeTryCount < MAX_TRY_COUNT) {
                logger.error(sprintf("Cannot write to %s. Erros is %s.", path, err));
                // TODO: set timeout to retry write
                // setTimeout(this._writeData, 1000); 
            }
        });
    }

    private async _readData(path:string, successMessage: string, options: Object) : Promise<string | void> {
        return fs.readFile(path, options)
        .then(buffer => {return buffer.toString()})
        .catch(err => {
            logger.error(sprintf("Cannot read from %s. Erros is %s.", path, err));
        });
    }


    private async _importCollection<T extends Interface.IUser | Interface.ITemplate>
                                    (path: string, successMessage: string, fromJSON: (j: string) => T | null, collection: Map<string, T>) : Promise<void>{
        return this._readData(path, successMessage, options)
        .then(data => {
            if(data) {
                let documents: Array<string> = JSON.parse(data);
                documents.forEach(doc => {
                    console.log("Inserting: ");
                    console.log(doc);
                    let docObject: T | null = fromJSON(JSON.stringify(doc));
                    if(docObject){
                        this._insert<T>(docObject, collection, undefined, false);
                    } else {
                        throw(new Error("Error when importing a document: cannot parse a document due to wrong JSON structure."))
                    }
                });
            }
        })
        .catch(err => logger.error(err));
    }

    private _checkID<T extends Interface.ITemplate | Interface.IUser>(doc: T){
        if(!doc._id) {
            doc._id = generateUniqueID();
        }
    }


    private async _commitCollection<T extends Interface.IUser | Interface.ITemplate>
                                    (path: string, successMessage: string, collection: T[], options: Object) : Promise<void>{
        
        let data: string = JSON.stringify(Array.from(collection));
        return this._writeData(path, data, successMessage, options);

    }

    private async _commitUsers() : Promise<void> {
        let data: Array<Interface.IUser> = Array.from(this.users.values());
        return this._commitCollection(usersPath,
                        sprintf(SUCCES_WRITE_MESSAGE, USER_COLLECTION_NAME), data, options);
    }

    private async _commitTemplates() : Promise<void>{
        
        let data: string = JSON.stringify(Array.from(this.templates.values()));
        return this._writeData(templatesPath, data, 
                        sprintf(SUCCES_WRITE_MESSAGE, TEMPLATE_COLLECTION_NAME), options);
    }

    private _setTimestamps(doc: Collections.Template) : void{
        doc.createdAt = new Date(Date.now());
    }

    async insertUser(doc: Collections.User) : Promise<void> {
        return this._insert<Collections.User>(doc, this.users, this._commitUsers.bind(this), true);
    }
    async insertTemplate(doc: Collections.Template) : Promise<void> {
        this._setTimestamps(doc);
        return this._insert<Collections.Template>(doc, this.templates, this._commitTemplates.bind(this), true);
    }
    
    async getTemplate(query: Queries.TemplateQuery): Promise<Collections.Template[]> {
        let res: Collections.Template[] = new Array();
        Array.from(this.templates.values()).forEach(template => {
            if(this._matchTemplate(query, template)) {
                res.push(template)
            }
        })
        return res;
    }

    async getUser(query: Queries.UserQuery): Promise<Collections.User[]> {
        let res: Collections.User[] = new Array();
        Array.from(this.users.values()).forEach(user => {
            if(this._matchUser(query, user)) {
                res.push(user)
            }
        })
        return res;
        
    }

    getInstanceByVersion(template: Collections.Template, version:string) : Collections.TemplateInstance | undefined{
        return template.instances.find(instance => instance.version === version);
    }


    async importDB() : Promise<void> {
        await this._importCollection<Collections.User>(usersPath, sprintf(SUCCES_IMPORT_MESSAGE, USER_COLLECTION_NAME), Collections.User.fromJSON, this.users);
        await this._importCollection<Collections.Template>(templatesPath, sprintf(SUCCES_IMPORT_MESSAGE, TEMPLATE_COLLECTION_NAME), Collections.Template.fromJSON, this.templates);
    }

     
    async exportDB() {
        await this._commitUsers();
        await this._commitTemplates();
    }



    private _matchUser(query: Queries.UserQuery, user: Collections.User) : boolean {

        if(query.userID && !(query.userID === user._id)) {
            return false;
            
        }
        if(query.email && !(query.email === user.email)) {
            return false;
        }

    
        if(query.orgID) {
            for(let org of query.orgID) {
                if(!user.org.includes(org)) {
                    return false;
                }
            }
        }
        
        if(query.teamID) {
            for(let team of query.teamID) {
                if(!user.team.includes(team)) {
                    return false;
                }
            }
        }
        return true;
    }

    private _matchTemplate(query: Queries.TemplateQuery, template: Collections.Template) : boolean {
        if(query.owner && !(query.owner === template.owner)) {
            return false;
            
        }
        if(query.templateID && !(query.templateID === template._id)) {
            return false;
        }
 
        if(query.isPublished && !(query.isPublished === template.isPublished)) {
            return false
        }
 
        if(query.tags) {
            for(let tag of query.tags) {
                if(!template.tags.includes(tag)) {
                  return false;
                }
            }
        }
        
        if(query.version) {
             let ifVersion: boolean = false
             for(let instance of template.instances) {
                 if(instance.version === query.version) {
                     ifVersion = true
                     break;
                 }               
             }
             if(!ifVersion) {
                 return false
             }
         }
 
     return true;
    }
}