export module Interface {
    export interface ITemplate {
        _id?: string,
        template: JSON,
        owner: string,
        createdAt: Date,
        isPublished: boolean
    }
}

export module Collections {
    export class Template implements Interface.ITemplate {
        _id?: string;
        template: JSON;
        owner: string;
        createdAt: Date;
        isPublished: boolean;   
        
        constructor(owner: string, createdAt: Date, template: JSON, isPublished: boolean, _id?: string) {
            this.owner = owner;
            this.createdAt = createdAt;
            this.template = template;
            this.isPublished = isPublished;
            if(_id) {
                this._id = _id;
            }
        }
    }
}
