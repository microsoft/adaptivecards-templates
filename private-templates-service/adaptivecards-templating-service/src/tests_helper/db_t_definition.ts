import { StorageProvider } from "../storageproviders/IStorageProvider";
import { IUser, ITemplate, ITemplateInstance, JSONResponse, TemplateState } from "../models/models";

function autoCompleteUserModel(user: IUser): void {
  if (!user.recentlyViewedTemplates) {
    user.recentlyViewedTemplates = [];
  }
  if (!user.recentlyEditedTemplates) {
    user.recentlyEditedTemplates = [];
  }
  if (!user.recentTags) {
    user.recentTags = [];
  }
  if (!user.favoriteTags) {
    user.favoriteTags = [];
  }
}

function autoCompleteTemplateInstanceModel(instance: ITemplateInstance): void {
  if (!instance.state) {
    instance.state = TemplateState.draft;
  }
  if (!instance.isShareable) {
    instance.isShareable = false;
  }
  if (!instance.numHits) {
    instance.numHits = 0;
  }
  if (!instance.data) {
    instance.data = [];
  }
  if (!instance.publishedAt) {
    instance.publishedAt = undefined;
  }
  if (!instance.data) {
    instance.data = [];
  }
  if(!instance.lastEditedUser) {
    instance.lastEditedUser = "";
  }
}
function autoCompleteTemplateModel(template: ITemplate): void {
  if (!template.tags) {
    template.tags = [];
  } else {
    template.tags = template.tags.map(x => {
      return x.toLowerCase();
    });
  }
  if (!template.isLive) {
    template.isLive = false;
  }
  if (!template.authors) {
    template.authors = [""];
  }
  if (!template.instances) {
    template.instances = [];
  } else {
    for (let instance of template.instances) {
      autoCompleteTemplateInstanceModel(instance);
    }
  }
  if (!template.deletedVersions) {
    template.deletedVersions = [];
  }
}
export function validateResult<T>(result: JSONResponse<T>): void {
  expect(result.success).toBe(true);
  expect(result.result).toBeDefined();
  expect(result.errorMessage).toBeUndefined();
}

function validateMatchingInstances(a: ITemplateInstance, b: ITemplateInstance) {
  expect(a.json).toEqual(b.json);
  expect(a.version).toBe(b.version);
  expect(a.state).toBe(b.state);
  expect(a.numHits).toBe(b.numHits);
  expect(a.data).toEqual(b.data);
  expect(a.isShareable).toBe(b.isShareable);
  expect(a.lastEditedUser).toBe(b.lastEditedUser);
}
export function validateMatchingTemplates(a: ITemplate, b: ITemplate): void {
  expect(a.instances!.length).toEqual(b.instances!.length);
  for (let i = 0; i < a.instances!.length; i++) {
    validateMatchingInstances!(a.instances![i], b.instances![i]);
  }
  expect(a.name).toEqual(b.name);
  expect(a.tags).toEqual(Array.from(b.tags!));
  expect(a.authors).toEqual(b.authors);
  expect(a.isLive).toEqual(b.isLive);
  expect(a.deletedVersions).toEqual(Array.from(b.deletedVersions!));
}

export function validateMatchingUsers(a: IUser, b: IUser): void {
  expect(a.authIssuer).toEqual(b.authIssuer);
  expect(a.authId).toEqual(b.authId);
  expect(a.recentlyViewedTemplates).toEqual(Array.from(b.recentlyViewedTemplates!));
  expect(a.recentlyEditedTemplates).toEqual(Array.from(b.recentlyEditedTemplates!));
  expect(a.recentTags).toEqual(Array.from(b.recentTags!));
  expect(a.favoriteTags).toEqual(Array.from(b.favoriteTags!));
}

async function insertAndValidateUser(db: StorageProvider, user: IUser): Promise<void> {
  let userId: string;
  await db.insertUser(user).then(result => {
    validateResult(result);
    userId = result.result!;
  });
  await db.getUsers({ _id: userId! }).then(result => {
    validateResult(result);
    let retrievedUser: IUser = result.result![0];
    expect(retrievedUser._id).toBe(userId);
    autoCompleteUserModel(user);
    validateMatchingUsers(user, retrievedUser);
  });
}

async function insertAndValidateTemplate(db: StorageProvider, template: ITemplate): Promise<void> {
  let templateId: string;
  await db.insertTemplate(template).then(result => {
    validateResult(result);
    templateId = result.result!;
  });
  await db.getTemplates({ _id: templateId! }).then(result => {
    validateResult(result);
    let retrievedTemplate: ITemplate = result.result![0];
    expect(retrievedTemplate._id).toBe(templateId);
    autoCompleteTemplateModel(template);
    validateMatchingTemplates(template, retrievedTemplate);
  });
}

export function testDB(db: StorageProvider) {
  beforeAll(async () => {
    await db.connect().then(result => {
      if (result.success) {
        console.log("DB has successfully connected.");
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
    const validUser: IUser = {
      authIssuer: "Microsoft Oauth2",
      authId: "51201",
      recentlyEditedTemplates: ["template1"],
      recentlyViewedTemplates: ["template2"],
      recentTags: ["tag1", "tag2"],
      favoriteTags: []
    };
    await insertAndValidateUser(db, validUser);
  });

  it("Partially filled: create & save user successfully", async () => {
    const validUser: IUser = {
      authIssuer: "Microsoft Oauth2",
      authId: "51202"
    };
    await insertAndValidateUser(db, validUser);
  });

  it("Completely filled:create & save template successfully", async () => {
    const validTemplateInstance: ITemplateInstance = {
      json: JSON.parse('{"key":"value"}'),
      version: "1.0",
      lastEditedUser: "",
      author: "12301ased12"
    };
    const validTemplate: ITemplate = {
      name: "validTemplate",
      instances: [validTemplateInstance],
      tags: ["weather", "sunny"],
      authors: ["12301ased12"],
      isLive: true
    };
    await insertAndValidateTemplate(db, validTemplate);
  });

  it("Partially filled:create & save template successfully", async () => {
    const validTemplate: ITemplate = { name: "validTemplate", authors: ["John"] };
    await insertAndValidateTemplate(db, validTemplate);
  });
}
