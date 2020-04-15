import request from "supertest";
import { TemplateServiceClient } from "../index";
import { ClientOptions } from "../IClientOptions";
import { AzureADProvider } from "../authproviders/AzureADProvider";
import express, { Router } from "express";
import mongoose, { version } from "mongoose";
import bodyParser from "body-parser";
import { InMemoryDBProvider } from "../storageproviders/InMemoryDBProvider";
import { ITemplate, ITemplateInstance } from "../models/models";

export default async function getToken(): Promise<string> {
  const request = require("request-promise");
  const endpoint = "https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token";
  const requestParams = {
    grant_type: "client_credentials",
    client_id: process.env.ACMS_APP_ID,
    client_secret: process.env.ACMS_APP_SECRET,
    resource: process.env.ACMS_APP_ID
  };
  return await request
    .post({ url: endpoint, form: requestParams }) // put in try catch
    .then((err: any, response: any, body: any) => {
      if (err) {
        let parsedBody = JSON.parse(err);
        return Promise.resolve(parsedBody.access_token);
      } else {
        console.log("Body=" + body);
        let parsedBody = JSON.parse(body);
        if (parsedBody.error_description) {
          console.log("Error=" + parsedBody.error_description);
          return Promise.resolve(parsedBody.error_description);
        } else {
          console.log("Access Token=" + parsedBody.access_token);
          return Promise.resolve(parsedBody.access_token);
        }
      }
    });
}

let options: ClientOptions = {
  authenticationProvider: new AzureADProvider(),
  storageProvider: new InMemoryDBProvider()
};

export function testDefaultTemplateParameters(template: ITemplate) {
  expect(template).toHaveProperty("name");
  expect(template).toHaveProperty("authors");
  expect(template).toHaveProperty("deletedVersions");
  expect(template).toHaveProperty("isLive");
  expect(template).toHaveProperty("updatedAt");
  expect(template).toHaveProperty("createdAt");
  expect(template).toHaveProperty("_id");
  expect(template).toHaveProperty("instances");
}

export function testDefaultTemplateInstanceParameters(instance: ITemplateInstance) {
  expect(instance).toHaveProperty("json");
  expect(instance).toHaveProperty("version");
  expect(instance).toHaveProperty("state");
  expect(instance).toHaveProperty("author");
  expect(instance).toHaveProperty("isShareable");
  expect(instance).toHaveProperty("numHits");
  expect(instance).toHaveProperty("data");
  expect(instance).toHaveProperty("updatedAt");
  expect(instance).toHaveProperty("lastEditedUser");
}

describe("Basic Post Templates", () => {
  let token: string;
  const app = express();
  let id: string;
  let idsToDelete: string[] = [];

  beforeAll(async () => {
    // TODO: request access token for registered AD app
    token = await getToken();
    let templateClient = TemplateServiceClient.init(options);
    let middleware: Router = templateClient.expressMiddleware();
    let userMiddleware: Router = templateClient.userExpressMiddleware();
    app.use(bodyParser.json());
    app.use("/template", middleware);
    app.use("/user", userMiddleware);
  });

  // Unauthenticated request
  it("should try to post without authenticating and fail", async () => {
    const res = await request(app)
      .post("/template")
      .send({
        template: {},
        isPublished: false
      });
    expect(res.status).toEqual(401);
  });

  // Authenticated post request
  it("should try to post with valid template with default parameters and succeed", async () => {
    let res = await request(app)
      .post("/template")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {}
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("id");
    id = res.body.id;
    idsToDelete.push(id);

    // User object should also be created
    const userRes = await request(app)
      .get("/user")
      .set({ Authorization: "Bearer " + token });
    expect(userRes.status).toEqual(200);
    expect(res.body).toHaveProperty("id");
    id = res.body.id;
  });

  // Template should exist in general GET
  it("should try to get the last template and succeed", async () => {
    const res = await request(app)
      .get("/template")
      .set({ Authorization: "Bearer " + token });

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("templates");
    expect(res.body.templates).toHaveLength(1);
    let template = res.body.templates[0];
    testDefaultTemplateParameters(template);
  });

  // Template should exist in specific GET by id
  it("should try to get specific template by id and succeed", async () => {
    let res = await request(app)
      .get(`/template/${id}`)
      .set({ Authorization: "Bearer " + token });

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("templates");
    expect(res.body.templates).toHaveLength(1);
    let template = res.body.templates[0];
    expect(template).toHaveProperty("_id");
    expect(template._id).toMatch(id);
    testDefaultTemplateParameters(template);
    expect(template.instances).toHaveLength(1);
    let instance = template.instances[0];
    testDefaultTemplateInstanceParameters(instance);
  });

  // Authenticated post request
  it("should try to post multiple versions of a template", async () => {
    let res = await request(app)
      .post("/template")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {}
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("id");
    id = res.body.id;
    idsToDelete.push(id);

    res = await request(app)
      .post(`/template/${id}`)
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {},
        version: "1.2"
      });
    expect(res.status).toEqual(201);
    idsToDelete.push(res.body.id);

    res = await request(app)
      .get("/template")
      .set({ Authorization: "Bearer " + token });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("templates");
    expect(res.body.templates).toHaveLength(2);
  });

  it("should try to delete existing user and succeed", async () => {
    const res = await request(app)
      .delete("/user")
      .set({ Authorization: "Bearer " + token });
    expect(res.status).toEqual(204);
    expect({ user: [] });

    // No more templates under user
    const templateRes = await request(app)
      .get("/template")
      .set({ Authorization: "Bearer " + token })
      .expect({ templates: [] });
  });

  // Authenticated post request with invalid template
  it("should try to post with invalid template and fail", async () => {
    const res = await request(app)
      .post("/template")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: "{",
        isPublished: false
      });
    expect(res.status).toEqual(400);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    for (let id of idsToDelete) {
      await request(app).delete(`/template/${id}`)
        .set({ Authorization: "Bearer " + token });
    }
  });
});

describe("Basic Get Templates", () => {
  let token: string;
  const app = express();
  let id: string;
  let idsToDelete: string[] = [];

  beforeAll(async () => {
    // TODO: request access token for registered AD app
    token = await getToken();
    let templateClient = TemplateServiceClient.init(options);
    let middleware: Router = templateClient.expressMiddleware();
    let userMiddleware: Router = templateClient.userExpressMiddleware();
    app.use(bodyParser.json());
    app.use("/template", middleware);
    app.use("/user", userMiddleware);
  });

  // Unauthenticated get request
  it("should try to get the templates without authenticating and fail", async () => {
    const res = await request(app).get("/template");
    expect(res.status).toEqual(401);
  });

  // Authenticated get request
  it("should try to get the templates and succeed", async () => {
    const res = await request(app)
      .get("/template")
      .set({ Authorization: "Bearer " + token });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("templates");
  });

  // Authenticated post request
  it("should try to post multiple versions of a template and succeed", async () => {
    let res = await request(app)
      .post("/template")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {}
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("id");
    id = res.body.id;
    idsToDelete.push(id);

    res = await request(app)
      .post(`/template/${id}`)
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {},
        version: "1.2"
      });
    expect(res.status).toEqual(201);
    idsToDelete.push(id);

    res = await request(app)
      .get("/template")
      .set({ Authorization: "Bearer " + token });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("templates");
    expect(res.body.templates).toHaveLength(1);
    let template = res.body.templates[0];
    id = template._id;
    expect(template.instances).toHaveLength(1);
    // Check that only the latest version is returned
    expect(template.instances[0].version).toMatch("1.2");
  });

  it("should try to get all versions of a specific template and succeed", async () => {
    const res = await request(app)
      .get(`/template/${id}`)
      .set({ Authorization: "Bearer " + token });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("templates");
    expect(res.body.templates).toHaveLength(1);
    let template = res.body.templates[0];
    expect(template.instances).toHaveLength(2);
  });

  afterAll(async () => {
    for (let id of idsToDelete) {
      await request(app).delete(`/template/${id}`)
        .set({ Authorization: "Bearer " + token });
    }
  });
});

describe("Preview Templates", () => {
  let token: string;
  const app = express();
  let id: string;
  let idsToDelete: string[] = [];

  beforeAll(async () => {
    // TODO: request access token for registered AD app
    token = await getToken();
    let templateClient = TemplateServiceClient.init(options);
    let middleware: Router = templateClient.expressMiddleware();
    app.use(bodyParser.json());
    app.use("/template", middleware);
  });

  it("should try to get posted template preview and succeed", async () => {
    let res = await request(app)
      .post("/template")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {},
        version: "1.2",
        isShareable: true
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("id");
    id = res.body.id;
    idsToDelete.push(id);

    res = await request(app).get(`/template/${id}/preview?version=1.2`);
    expect(res.body).toHaveProperty("template");
    let template = res.body.template;
    expect(template).toHaveProperty("_id");
    expect(template).toHaveProperty("name");
    expect(template).toHaveProperty("tags");
    expect(template).toHaveProperty("instance");
    let instance = template.instance;
    expect(instance).toHaveProperty("version");
    expect(instance.version).toEqual("1.2");
    expect(instance).toHaveProperty("json");
    expect(instance).toHaveProperty("state");
    expect(instance.state).toEqual("draft");
    expect(instance).toHaveProperty("author");
  });

  it("should try to get posted template preview without passing version and fail", async () => {
    const res = await request(app).get(`/template/${id}/preview`);
    expect(res.status).toEqual(404);
  });

  it("should try to get posted template preview of un-shareable template version and fail", async () => {
    let res = await request(app)
      .post("/template")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {},
        version: "1.0",
        isShareable: false
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("id");
    id = res.body.id;
    idsToDelete.push(id);

    res = await request(app).get(`/template/${id}`)
      .set({ Authorization: "Bearer " + token });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("templates");
    expect(res.body.templates).toHaveLength(1);
    let template = res.body.templates[0];
    expect(template.instances).toHaveLength(1);
    expect(template.instances[0]).toHaveProperty("isShareable");
    expect(template.instances[0].isShareable).toEqual(false);

    res = await request(app).get(`/template/${id}/preview?version=1.0`);
    expect(res.status).toEqual(404);
  });

  afterAll(async () => {
    for (let id of idsToDelete) {
      await request(app).delete(`/template/${id}`)
        .set({ Authorization: "Bearer " + token });
    }
  });
});

describe("Delete Templates", () => {
  let token: string;
  const app = express();
  let id: string;
  let idsToDelete: string[] = [];

  beforeAll(async () => {
    // TODO: request access token for registered AD app
    token = await getToken();
    let templateClient = TemplateServiceClient.init(options);
    let middleware: Router = templateClient.expressMiddleware();
    app.use(bodyParser.json());
    app.use("/template", middleware);
  });

  it("should try to delete posted template and succeed", async () => {
    let res = await request(app)
      .post("/template")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {}
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("id");
    id = res.body.id;

    res = await request(app).delete(`/template/${id}`)
      .set({ Authorization: "Bearer " + token });
    expect(res.status).toEqual(204);

    res = await request(app).get(`/template/${id}`)
      .set({ Authorization: "Bearer " + token });
    expect(res.status).toEqual(404);
  });

  it("should try to delete a specific version of the posted template and succeed", async () => {
    let res = await request(app)
      .post("/template")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {}
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("id");
    id = res.body.id;
    idsToDelete.push(id);

    res = await request(app)
      .post(`/template/${id}`)
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {},
        version: "1.4"
      });
    expect(res.status).toEqual(201);

    res = await request(app).delete(`/template/${id}?version=1.4`)
      .set({ Authorization: "Bearer " + token });
    expect(res.status).toEqual(204);

    res = await request(app).get(`/template/${id}?version=1.4`)
      .set({ Authorization: "Bearer " + token });
    expect(res.status).toEqual(404);

    res = await request(app).get(`/template/${id}`)
      .set({ Authorization: "Bearer " + token });
    expect(res.status).toEqual(200);
    expect(res.body.templates[0].instances[0].version).toEqual("1.0");
  });

  it("should try to delete a multiple version of the posted template and succeed", async () => {
    let res = await request(app)
      .post("/template")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {},
        state: "live"
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("id");
    id = res.body.id;
    idsToDelete.push(id);

    res = await request(app)
      .post(`/template/${id}`)
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {},
        state: "live",
        version: "1.1"
      });
    expect(res.status).toEqual(201);

    res = await request(app).delete(`/template/${id}/batch`)
      .set({ Authorization: "Bearer " + token })
      .send({
        versions: [
          "1.0",
          "1.1"
        ]
      });
    expect(res.status).toEqual(204);

    res = await request(app).get(`/template/${id}`)
      .set({ Authorization: "Bearer " + token });
    expect(res.status).toEqual(404);
  });

  afterAll(async () => {
    for (let id of idsToDelete) {
      await request(app).delete(`/template/${id}`)
        .set({ Authorization: "Bearer " + token });
    }
  });
});


describe("Batch Update Templates", () => {
  let token: string;
  const app = express();
  let id: string;
  let idsToDelete: string[] = [];

  beforeAll(async () => {
    // TODO: request access token for registered AD app
    token = await getToken();
    let templateClient = TemplateServiceClient.init(options);
    let middleware: Router = templateClient.expressMiddleware();
    app.use(bodyParser.json());
    app.use("/template", middleware);
  });

  it("should try to unpublish multiple templates and succeed", async () => {
    let res = await request(app)
      .post("/template")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {},
        state: "live",
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("id");
    id = res.body.id;
    idsToDelete.push(id);

    res = await request(app)
      .post(`/template/${id}`)
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {},
        state: "live",
        version: "1.1"
      });
    expect(res.status).toEqual(201);
    idsToDelete.push(id);

    res = await request(app).post(`/template/${id}/batch`)
      .set({ Authorization: "Bearer " + token })
      .send({
        templates: [
          {
            version: "1.0",
            state: "deprecated"
          },
          {
            version: "1.1",
            state: "deprecated"
          }
        ]
      })
    expect(res.status).toEqual(201);

    res = await request(app).get(`/template/${id}?version=1.0`)
      .set({ Authorization: "Bearer " + token });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("templates");
    expect(res.body.templates).toHaveLength(1);
    expect(res.body.templates[0].instances).toHaveLength(1);
    expect(res.body.templates[0].instances[0].state).toEqual("deprecated");

    res = await request(app).get(`/template/${id}?version=1.1`)
      .set({ Authorization: "Bearer " + token });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("templates");
    expect(res.body.templates).toHaveLength(1);
    expect(res.body.templates[0].instances).toHaveLength(1);
    expect(res.body.templates[0].instances[0].state).toEqual("deprecated");
  });

  afterAll(async () => {
    for (let id of idsToDelete) {
      await request(app).delete(`/template/${id}`)
        .set({ Authorization: "Bearer " + token });
    }
  });
});

describe("Filtering Templates", () => {
  let token: string;
  const app = express();
  let id: string;
  let idsToDelete: string[] = [];

  beforeAll(async () => {
    // TODO: request access token for registered AD app
    token = await getToken();
    let templateClient = TemplateServiceClient.init(options);
    let middleware: Router = templateClient.expressMiddleware();
    app.use(bodyParser.json());
    app.use("/template", middleware);
  });

  it("should try to filter template by tag and succeed", async () => {
    let res = await request(app)
      .post("/template")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {},
        tags: ["weather"]
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("id");
    id = res.body.id;
    idsToDelete.push(id);

    res = await request(app)
      .post("/template")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {},
        tags: ["sunny"]
      });
    expect(res.status).toEqual(201);
    idsToDelete.push(res.body.id);

    res = await request(app)
      .get("/template?tags[0]=weather")
      .set({ Authorization: "Bearer " + token });
    expect(res.status).toEqual(200);
    expect(res.body.templates).toHaveLength(1);
  });

  afterAll(async () => {
    for (let id of idsToDelete) {
      await request(app).delete(`/template/${id}`)
        .set({ Authorization: "Bearer " + token });
    }
  });
});

describe("Get Tags", () => {
  let token: string;
  const app = express();
  let id: string;
  let idsToDelete: string[] = [];

  beforeAll(async () => {
    // TODO: request access token for registered AD app
    token = await getToken();
    let templateClient = TemplateServiceClient.init(options);
    let middleware: Router = templateClient.expressMiddleware();
    app.use(bodyParser.json());
    app.use("/template", middleware);
  });

  it("should try to post tags with a template and succeed", async () => {
    let res = await request(app)
      .post("/template")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {},
        tags: ["weather"],
        isPublished: false
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("id");
    id = res.body.id;
    idsToDelete.push(id);

    res = await request(app).get(`/template/${id}`)
      .set({ Authorization: "Bearer " + token });
    expect(res.body).toHaveProperty("templates");
    expect(res.body.templates).toHaveLength(1);
    let template = res.body.templates[0];
    expect(template.tags).toHaveLength(1);
    expect(template.tags[0]).toEqual("weather");

    res = await request(app)
      .post("/template")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {},
        tags: ["contosa"],
        isPublished: true
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("id");
    await request(app).delete(`/template/${res.body.id}`);
    idsToDelete.push(res.body.id);
  });

  // Authenticated post request
  it("should try to get the list of owners and all tags and succeed", async () => {
    let res = await request(app).get("/template/tag")
      .set({ Authorization: "Bearer " + token });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("ownedTags");
    expect(res.body).toHaveProperty("allTags");
    expect(res.body.ownedTags).toHaveLength(2);
    expect(res.body.ownedTags).toContain("weather");
    expect(res.body.ownedTags).toContain("contosa");
    expect(res.body.allTags).toHaveLength(2);
    expect(res.body.allTags).toContain("contosa");
    expect(res.body.allTags).toContain("weather");
  });

  afterAll(async () => {
    for (let id of idsToDelete) {
      await request(app).delete(`/template/${id}`)
        .set({ Authorization: "Bearer " + token });
    }
  });
});

describe("Post Templates, and increment version", () => {
  let token: string;
  const app = express();
  let id: string;
  let idsToDelete: string[] = [];

  beforeAll(async () => {
    // TODO: request access token for registered AD app
    token = await getToken();
    let templateClient = TemplateServiceClient.init(options);
    let middleware: Router = templateClient.expressMiddleware();
    let userMiddleware: Router = templateClient.userExpressMiddleware();
    app.use(bodyParser.json());
    app.use("/template", middleware);
    app.use("/user", userMiddleware);
  });

  // Unauthenticated request
  it("should try to post without authenticating and fail", async () => {
    const res = await request(app)
      .post("/template")
      .send({
        template: {},
        isPublished: false
      });
    expect(res.status).toEqual(401);
  });

  // Authenticated post request
  it("should try to post with valid template with default parameters and succeed", async () => {
    let res = await request(app)
      .post("/template")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {}
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("id");
    id = res.body.id;
    idsToDelete.push(id);

    // User object should also be created
    const userRes = await request(app)
      .get("/user")
      .set({ Authorization: "Bearer " + token });
    expect(userRes.status).toEqual(200);
    expect(res.body).toHaveProperty("id");
    id = res.body.id;
  });

  // Template should exist in general GET
  it("should try to get the last template and succeed", async () => {
    const res = await request(app)
      .get("/template")
      .set({ Authorization: "Bearer " + token });

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("templates");
    expect(res.body.templates).toHaveLength(1);
    let template = res.body.templates[0];
    testDefaultTemplateParameters(template);
  });

  // Template should exist in specific GET by id
  it("should try to get specific template by id and succeed", async () => {
    let res = await request(app)
      .get(`/template/${id}`)
      .set({ Authorization: "Bearer " + token });

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("templates");
    expect(res.body.templates).toHaveLength(1);
    let template = res.body.templates[0];
    expect(template).toHaveProperty("_id");
    expect(template._id).toMatch(id);
    testDefaultTemplateParameters(template);
    expect(template.instances).toHaveLength(1);
    let instance = template.instances[0];
    testDefaultTemplateInstanceParameters(instance);
  });

  // Authenticated post request
  // send first instance 
  it("should try to post multiple versions of a template", async () => {
    let res = await request(app)
      .post("/template")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {},
        state: "live"
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("id");
    id = res.body.id;
    idsToDelete.push(id);

    // send second instance 
    res = await request(app)
      .post(`/template/${id}`)
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {}
      });
    expect(res.status).toEqual(201);
    idsToDelete.push(res.body.id);

    // send third instance 
    res = await request(app)
      .post(`/template/${id}`)
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {}
      });
    expect(res.status).toEqual(201);
    idsToDelete.push(res.body.id);

    //recive instances 
    res = await request(app)
      .get(`/template/${id}`)
      .set({ Authorization: "Bearer " + token });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("templates");
    let instances = res.body.templates[0].instances
    expect(instances[0].version).toEqual("1.2")
    expect(instances[0].state).toEqual("draft")
    expect(instances[1].version).toEqual("1.1")
    expect(instances[1].state).toEqual("draft")
    expect(instances[2].version).toEqual("1.0")
    expect(instances[2].state).toEqual("live")


    //edit first instance
    res = await request(app)
      .post(`/template/${id}`)
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {},
        version: "1.0",
        state: "deprecated"
      });
    expect(res.status).toEqual(201);
    idsToDelete.push(res.body.id);

    //edit third instance which is deprecated, should create a new instance 1.3 
    res = await request(app)
      .post(`/template/${id}`)
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {},
        version: "1.0",
      });
    expect(res.status).toEqual(201);
    idsToDelete.push(res.body.id);

    res = await request(app)
      .get(`/template/${id}`)
      .set({ Authorization: "Bearer " + token });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("templates");
    let instancesAfter = res.body.templates[0].instances
    expect(instancesAfter[0].version).toEqual("1.3")
    expect(instancesAfter[0].state).toEqual("draft")
    expect(instancesAfter[1].version).toEqual("1.2")
    expect(instancesAfter[1].state).toEqual("draft")
    expect(instancesAfter[2].version).toEqual("1.1")
    expect(instancesAfter[2].state).toEqual("draft")
    expect(instancesAfter[3].version).toEqual("1.0")
    expect(instancesAfter[3].state).toEqual("deprecated")
  });

  it("should try to delete existing user and succeed", async () => {
    const res = await request(app)
      .delete("/user")
      .set({ Authorization: "Bearer " + token });
    expect(res.status).toEqual(204);
    expect({ user: [] });

    // No more templates under user
    const templateRes = await request(app)
      .get("/template")
      .set({ Authorization: "Bearer " + token })
      .expect({ templates: [] });
  });

  // Authenticated post request with invalid template
  it("should try to post with invalid template and fail", async () => {
    const res = await request(app)
      .post("/template")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: "{",
        isPublished: false
      });
    expect(res.status).toEqual(400);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    for (let id of idsToDelete) {
      await request(app).delete(`/template/${id}`)
        .set({ Authorization: "Bearer " + token });
    }
  });
});

describe("Basic Get Templates", () => {
  let token: string;
  const app = express();
  let id: string;
  let idsToDelete: string[] = [];

  beforeAll(async () => {
    // TODO: request access token for registered AD app
    token = await getToken();
    let templateClient = TemplateServiceClient.init(options);
    let middleware: Router = templateClient.expressMiddleware();
    let userMiddleware: Router = templateClient.userExpressMiddleware();
    app.use(bodyParser.json());
    app.use("/template", middleware);
    app.use("/user", userMiddleware);
  });

  // Unauthenticated get request
  it("should try to get the templates without authenticating and fail", async () => {
    const res = await request(app).get("/template");
    expect(res.status).toEqual(401);
  });

  // Authenticated get request
  it("should try to get the templates and succeed", async () => {
    const res = await request(app)
      .get("/template")
      .set({ Authorization: "Bearer " + token });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("templates");
  });

  // Authenticated post request
  it("should try to post multiple versions of a template and succeed", async () => {
    let res = await request(app)
      .post("/template")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {}
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("id");
    id = res.body.id;
    idsToDelete.push(id);

    res = await request(app)
      .post(`/template/${id}`)
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {},
        version: "1.2"
      });
    expect(res.status).toEqual(201);
    idsToDelete.push(id);

    res = await request(app)
      .get("/template")
      .set({ Authorization: "Bearer " + token });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("templates");
    expect(res.body.templates).toHaveLength(1);
    let template = res.body.templates[0];
    id = template._id;
    expect(template.instances).toHaveLength(1);
    // Check that only the latest version is returned
    expect(template.instances[0].version).toMatch("1.2");
  });
});

describe("Post Templates: Data Binding", () => {
  let token: string;
  const app = express();
  let id: string;
  let idsToDelete: string[] = [];

  beforeAll(async () => {
    // TODO: request access token for registered AD app
    token = await getToken();
    let templateClient = TemplateServiceClient.init(options);
    let middleware: Router = templateClient.expressMiddleware();
    let userMiddleware: Router = templateClient.userExpressMiddleware();
    app.use(bodyParser.json());
    app.use("/template", middleware);
    app.use("/user", userMiddleware);
  });

  it("pass in a data json, version, and id and should receive that version of the template with the data bound", async () => {
    let res = await request(app)
      .post("/template")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {}
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("id");
    id = res.body.id;
    idsToDelete.push(id);

    res = await request(app)
      .post(`/template/${id}`)
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {
          "type": "AdaptiveCard",
          "version": "1.0",
          "body": [
            {
              "type": "TextBlock",
              "text": "{greeting} {name} V1.0"
            }
          ],
          "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
        },
        version: "1.0"
      });
    expect(res.status).toEqual(201);
    idsToDelete.push(id);

    res = await request(app)
      .post(`/template/${id}`)
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {
          "type": "AdaptiveCard",
          "version": "1.0",
          "body": [
            {
              "type": "TextBlock",
              "text": "{greeting} {name} V1.1"
            }
          ],
          "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
        },
        version: "1.1"
      });
    expect(res.status).toEqual(201);
    idsToDelete.push(id);

    res = await request(app)
      .post(`/template/${id}`)
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {
          "type": "AdaptiveCard",
          "version": "1.0",
          "body": [
            {
              "type": "TextBlock",
              "text": "{greeting} {name} V1.2"
            }
          ],
          "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
        },
        version: "1.2"
      });
    expect(res.status).toEqual(201);
    idsToDelete.push(id);

    res = await request(app)
      .post(`/template/${id}`)
      .set({ Authorization: "Bearer " + token })
      .send({
        data: {
          "greeting": "hi",
          "name": "intern",
        },
        bindData: "true",
        version: "1.0"
      })
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("templates");
    expect(res.body.templates).toHaveLength(1);
    let template = res.body.templates[0];
    id = template._id;
    expect(template.instances).toHaveLength(1);
    // Check that the data was bound
    expect(JSON.stringify(template.instances[0].json)).toMatch(JSON.stringify({
      "type": "AdaptiveCard",
      "version": "1.0",
      "body": [
        {
          "type": "TextBlock",
          "text": "hi intern V1.0"
        }
      ],
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
    }));
  });

  it("pass in a data json, no version, and id and should receive the latest version of the template with the data bound", async () => {
    let res = await request(app)
      .post("/template")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {}
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("id");
    id = res.body.id;
    idsToDelete.push(id);

    res = await request(app)
      .post(`/template/${id}`)
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {
          "type": "AdaptiveCard",
          "version": "1.0",
          "body": [
            {
              "type": "TextBlock",
              "text": "{greeting} {name} version 1.0"
            }
          ],
          "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
        },
        version: "1.0"
      });
    expect(res.status).toEqual(201);
    idsToDelete.push(id);

    res = await request(app)
      .post(`/template/${id}`)
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {
          "type": "AdaptiveCard",
          "version": "1.0",
          "body": [
            {
              "type": "TextBlock",
              "text": "{greeting} {name} V1.0"
            }
          ],
          "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
        },
        version: "1.1"
      });
    expect(res.status).toEqual(201);
    idsToDelete.push(id);

    res = await request(app)
      .post(`/template/${id}`)
      .set({ Authorization: "Bearer " + token })
      .send({
        template: {
          "type": "AdaptiveCard",
          "version": "1.0",
          "body": [
            {
              "type": "TextBlock",
              "text": "{greeting} {name} V1.2"
            }
          ],
          "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
        },
        version: "1.2"
      });
    expect(res.status).toEqual(201);
    idsToDelete.push(id);

    res = await request(app)
      .post(`/template/${id}`)
      .set({ Authorization: "Bearer " + token })
      .send({
        data: {
          "greeting": "hi",
          "name": "intern",
        },
        bindData: "true",
      })
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("templates");
    expect(res.body.templates).toHaveLength(1);
    let template = res.body.templates[0];
    id = template._id;
    expect(template.instances).toHaveLength(1);
    // Check that the data was bound
    expect(JSON.stringify(template.instances[0].json)).toMatch(JSON.stringify({
      "type": "AdaptiveCard",
      "version": "1.0",
      "body": [
        {
          "type": "TextBlock",
          "text": "hi intern V1.2"
        }
      ],
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
    }));
  });

  afterAll(async () => {
    await mongoose.connection.close();
    for (let id of idsToDelete) {
      await request(app).delete(`/template/${id}`)
        .set({ Authorization: "Bearer " + token });
    }
  });
});
