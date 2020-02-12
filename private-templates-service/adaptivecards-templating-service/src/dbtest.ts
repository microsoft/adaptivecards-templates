import { InMemoryDBProvider } from "./storageproviders/InMemoryDBProvider";
import { ITemplateInstance, IUser } from "./models/models";

let db : InMemoryDBProvider = new InMemoryDBProvider();

db.insertUser({authId: "myid", issuer: "issuer"}).then(result => {
  console.log(result.success);
  if(result.success){
    console.log(result.result);
  }
})

db.insertTemplate({instances:[], name: "sunny", tags:["weather"] }).then(result => {
  console.log(result.result);
})
db.insertTemplate({instances:[], name: "sunny with clouds", tags:["weather"] }).then(result => {
  console.log(result.result);
})
db.insertTemplate({instances:[], name: " withsunny rain", tags:["weather"] }).then(result => {
  console.log(result.result);
})


db.getTemplates({tags:["weather"]}).then(result => {
  console.log(result.result);
})
