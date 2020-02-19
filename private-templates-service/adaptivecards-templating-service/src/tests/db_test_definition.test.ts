import { MongoDBProvider } from "../storageproviders/MongoDBProvider";
import { StorageProvider } from "../storageproviders/IStorageProvider";
import { IUser, ITemplate, ITemplateInstance, JSONResponse } from "../models/models";

export function validateResult<T>(result: JSONResponse<T>): void {
  expect(result.success).toBe(true);
  expect(result.result).toBeDefined();
  expect(result.errorMessage).toBeUndefined();
}

function validateMatchingInstances(a: ITemplateInstance, b: ITemplateInstance) {
  expect(a.json).toEqual(b.json);
  expect(a.version).toBe(b.version);
}
export function validateMatchingTemplates(a: ITemplate, b: ITemplate): void {
  expect(a.instances!.length).toEqual(b.instances!.length);
  for (let i = 0; i < a.instances!.length; i++) {
    validateMatchingInstances!(a.instances![i], b.instances![i]);
  }
  expect(a.name).toEqual(b.name);
  expect(a.tags).toEqual(Array.from(b.tags!));
  expect(a.owner).toEqual(b.owner);
  expect(a.isLive).toEqual(b.isLive);
}

export function validateMatchingUsers(a: IUser, b: IUser): void {
  expect(a.authId).toEqual(b.authId);
  expect(a.issuer).toEqual(b.issuer);
  expect(a.org).toEqual(Array.from(b.org!));
  expect(a.team).toEqual(Array.from(b.team!));
}

export function testDB(db: StorageProvider) {
  beforeAll(async () => {
    await db.connect().then(result => {
      if (result.success) {
        console.log("DB has successfully connected to the inmemory instance.");
      } else {
        console.error("Connection to local instance has failed. Test failed.");
        process.exit(1);
      }
    });
  });
  afterAll(async () => {
    await db.close().then(response => {
      if (response.success) {
        console.log("DB closed the connection successfully");
      } else {
        console.log("DB failed at closing connection. Test failed.");
        process.exit(1);
      }
    });
  });

  it("Completely filled: create & save user successfully", async () => {
    const validUser: IUser = { firstName: "John", lastName: "Travolta", issuer: "Microsoft Oauth2", authId: "51201", org: ["Microsoft"], team: ["Bing"] };
    let userId: string;
    await db.insertUser(validUser).then(result => {
      validateResult(result);
      userId = result.result!;
    });
    await db.getUsers({ _id: userId! }).then(result => {
      validateResult(result);
      let retrievedUser: IUser = result.result![0];
      expect(retrievedUser._id).toBe(userId);
      validateMatchingUsers(validUser, retrievedUser);
    });
  });

  it("Partially filled: create & save user successfully", async () => {
    const validUser: IUser = { firstName: "John", lastName: "Travolta", issuer: "Microsoft Oauth2", authId: "51201" };
    let userId: string;
    await db.insertUser(validUser).then(result => {
      validateResult(result);
      userId = result.result!;
    });
    validUser.org = [];
    validUser.team = [];
    await db.getUsers({ _id: userId! }).then(result => {
      validateResult(result);
      let retrievedUser: IUser = result.result![0];
      expect(retrievedUser._id).toBe(userId);
      validateMatchingUsers(validUser, retrievedUser);
    });
  });

  it("Completely filled:create & save template successfully", async () => {
    const validTemplateInstance: ITemplateInstance = { json: '"key":"value"', version: "1.0" };
    const validTemplate: ITemplate = {
      name: "validTemplate",
      instances: [validTemplateInstance],
      tags: ["weather", "sunny"],
      owner: "12301ased12",
      isLive: true
    };
    // const validTemplate: ITemplate = { name: "validTemplate", instances: [], owner: "12301ased12" };
    let templateId: string;
    await db.insertTemplate(validTemplate).then(result => {
      validateResult(result);
      templateId = result.result!;
    });

    await db.getTemplates({ _id: templateId! }).then(result => {
      validateResult(result);
      let retrievedTemplate: ITemplate = result.result![0];
      expect(retrievedTemplate._id).toBe(templateId);
      validateMatchingTemplates(validTemplate, retrievedTemplate);
    });
  });

  it("Partially filled:create & save template successfully", async () => {
    const validTemplate: ITemplate = { name: "validTemplate", owner: "John" };
    let templateId: string;
    await db.insertTemplate(validTemplate).then(result => {
      validateResult(result);
      templateId = result.result!;
    });
    validTemplate.owner = "";
    validTemplate.tags = [];
    validTemplate.isLive = false;

    await db.getTemplates({ _id: templateId! }).then(result => {
      validateResult(result);
      let retrievedTemplate: ITemplate = result.result![0];
      expect(retrievedTemplate._id).toBe(templateId);
      validateMatchingTemplates(validTemplate, retrievedTemplate);
    });
  });
}
