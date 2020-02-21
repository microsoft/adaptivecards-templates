import request from "supertest";
import { TemplateServiceClient } from "../index";
import { ClientOptions } from "../IClientOptions";
import { AzureADProvider } from "../authproviders/AzureADProvider";
import express, { Router } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { InMemoryDBProvider } from "../storageproviders/InMemoryDBProvider";
import { ITemplate, ITemplateInstance } from "../models/models";

let options: ClientOptions = {
  authenticationProvider: new AzureADProvider(),
  storageProvider: new InMemoryDBProvider()
};

export function testDefaultTemplateParameters(template: ITemplate) {
  expect(template).toHaveProperty("name");
  expect(template).toHaveProperty("owner");
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
  expect(instance).toHaveProperty("isShareable");
  expect(instance).toHaveProperty("numHits");
  expect(instance).toHaveProperty("data");
  expect(instance.data).toHaveLength(0);
  expect(instance).toHaveProperty("updatedAt");
}

describe("Basic Post Templates", () => {
  let token: string;
  const app = express();
  let id: string;

  beforeAll(async () => {
    // TODO: request access token for registered AD app
    // token = "<INSERT_APP_TOKEN_HERE>";
    token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSJ9.eyJhdWQiOiIyZTdhYzNmYS1lMTk4LTQ4YmQtYmI2Ny0yZTQzYWU3ZWViMzAiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE1ODIyMjY0ODIsIm5iZiI6MTU4MjIyNjQ4MiwiZXhwIjoxNTgyMjMwMzgyLCJhaW8iOiI0Mk5nWURpOXRmT2FVcVVSZTFiNHp2RFplaVVIQUE9PSIsImF6cCI6IjJlN2FjM2ZhLWUxOTgtNDhiZC1iYjY3LTJlNDNhZTdlZWIzMCIsImF6cGFjciI6IjEiLCJvaWQiOiIyOGVkOGFmYy04ODNiLTRmZDAtYmZjOC1kYWU3NGZkOGFiYjciLCJzdWIiOiIyOGVkOGFmYy04ODNiLTRmZDAtYmZjOC1kYWU3NGZkOGFiYjciLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1dGkiOiJTM1V4NjQ3NzhVNlhjaDM4NFpzRUFBIiwidmVyIjoiMi4wIn0.sCaGHe9m7eAyzFAPOA1ghuB6stZnGGWFwkS-0dI90hcZRXkylpiyEAHJBEym9xonZA-hIisvE5fX8gfpIVe9Jz1WwIpR47FY4Jh54Gmm84wBXobl9N33MiSA7Et6oKBzgRCZwnPmbiJd7zNFeLgD3gm-Q5Kq3bDkbyU4CFpleEGnHbCpD3yaR4q0meUQEx2-8Mu7yeLVbHaNYhMx6IGogiFRJov_07KMCgPOes1kiMRseddGg_2ARZjz51j3cOVQ4otqBHYtljaea1tyjlNeg6boy0jGVfzrvDvf-RnQ6bD2M1emv9uCB3_t0z8LHsLzyJ8BjOt0srFvy15keo6kKw";
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
    const res = await request(app)
      .post("/template")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: "{}"
      });
    expect(res.status).toEqual(201);

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
    const res = await request(app)
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
        template: "{}"
      });
    expect(res.status).toEqual(201);    
    expect(res.body).toHaveProperty("id");
    id = res.body.id;

    res = await request(app)
    .post(`/template/${id}`)
    .set({ Authorization: "Bearer " + token })
    .send({
      template: "{}", 
      version: "1.2"
    });
    expect(res.status).toEqual(201); 

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
      .send({
        isPublished: false
      })
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
  });
});


describe("Basic Get Templates", () => {
  let token: string;
  const app = express();
  let id: string;

  beforeAll(async () => {
    // TODO: request access token for registered AD app
    // token = "<INSERT_APP_TOKEN_HERE>";
    token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSJ9.eyJhdWQiOiIyZTdhYzNmYS1lMTk4LTQ4YmQtYmI2Ny0yZTQzYWU3ZWViMzAiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE1ODIyMjY0ODIsIm5iZiI6MTU4MjIyNjQ4MiwiZXhwIjoxNTgyMjMwMzgyLCJhaW8iOiI0Mk5nWURpOXRmT2FVcVVSZTFiNHp2RFplaVVIQUE9PSIsImF6cCI6IjJlN2FjM2ZhLWUxOTgtNDhiZC1iYjY3LTJlNDNhZTdlZWIzMCIsImF6cGFjciI6IjEiLCJvaWQiOiIyOGVkOGFmYy04ODNiLTRmZDAtYmZjOC1kYWU3NGZkOGFiYjciLCJzdWIiOiIyOGVkOGFmYy04ODNiLTRmZDAtYmZjOC1kYWU3NGZkOGFiYjciLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1dGkiOiJTM1V4NjQ3NzhVNlhjaDM4NFpzRUFBIiwidmVyIjoiMi4wIn0.sCaGHe9m7eAyzFAPOA1ghuB6stZnGGWFwkS-0dI90hcZRXkylpiyEAHJBEym9xonZA-hIisvE5fX8gfpIVe9Jz1WwIpR47FY4Jh54Gmm84wBXobl9N33MiSA7Et6oKBzgRCZwnPmbiJd7zNFeLgD3gm-Q5Kq3bDkbyU4CFpleEGnHbCpD3yaR4q0meUQEx2-8Mu7yeLVbHaNYhMx6IGogiFRJov_07KMCgPOes1kiMRseddGg_2ARZjz51j3cOVQ4otqBHYtljaea1tyjlNeg6boy0jGVfzrvDvf-RnQ6bD2M1emv9uCB3_t0z8LHsLzyJ8BjOt0srFvy15keo6kKw";
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
        template: "{}"
      });
    expect(res.status).toEqual(201);    
    expect(res.body).toHaveProperty("id");
    id = res.body.id;

    res = await request(app)
    .post(`/template/${id}`)
    .set({ Authorization: "Bearer " + token })
    .send({
      template: "{}", 
      version: "1.2"
    });
    expect(res.status).toEqual(201); 

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
    await mongoose.connection.close();
  });
});

describe("Get Tags", () => {
  let token: string;
  const app = express();
  let id: string;

  beforeAll(async () => {
    // TODO: request access token for registered AD app
    // token = "<INSERT_APP_TOKEN_HERE>";
    token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSJ9.eyJhdWQiOiIyZTdhYzNmYS1lMTk4LTQ4YmQtYmI2Ny0yZTQzYWU3ZWViMzAiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE1ODIyMjY0ODIsIm5iZiI6MTU4MjIyNjQ4MiwiZXhwIjoxNTgyMjMwMzgyLCJhaW8iOiI0Mk5nWURpOXRmT2FVcVVSZTFiNHp2RFplaVVIQUE9PSIsImF6cCI6IjJlN2FjM2ZhLWUxOTgtNDhiZC1iYjY3LTJlNDNhZTdlZWIzMCIsImF6cGFjciI6IjEiLCJvaWQiOiIyOGVkOGFmYy04ODNiLTRmZDAtYmZjOC1kYWU3NGZkOGFiYjciLCJzdWIiOiIyOGVkOGFmYy04ODNiLTRmZDAtYmZjOC1kYWU3NGZkOGFiYjciLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1dGkiOiJTM1V4NjQ3NzhVNlhjaDM4NFpzRUFBIiwidmVyIjoiMi4wIn0.sCaGHe9m7eAyzFAPOA1ghuB6stZnGGWFwkS-0dI90hcZRXkylpiyEAHJBEym9xonZA-hIisvE5fX8gfpIVe9Jz1WwIpR47FY4Jh54Gmm84wBXobl9N33MiSA7Et6oKBzgRCZwnPmbiJd7zNFeLgD3gm-Q5Kq3bDkbyU4CFpleEGnHbCpD3yaR4q0meUQEx2-8Mu7yeLVbHaNYhMx6IGogiFRJov_07KMCgPOes1kiMRseddGg_2ARZjz51j3cOVQ4otqBHYtljaea1tyjlNeg6boy0jGVfzrvDvf-RnQ6bD2M1emv9uCB3_t0z8LHsLzyJ8BjOt0srFvy15keo6kKw";
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
        template: "{}",
        tags: [
          "Weather"
        ],
        isPublished: false
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("id");
    id = res.body.id;
    
    res = await request(app)
      .get(`/template/${id}`)
    expect(res.body).toHaveProperty("templates");
    expect(res.body.templates).toHaveLength(1);
    let template = res.body.templates[0];
    expect(template.tags).toHaveLength(1);
    expect(template.tags[0]).toEqual("Weather");

    res = await request(app)
    .post("/template")
    .set({ Authorization: "Bearer " + token })
    .send({
      template: "{}",
      tags: [
        "Contosa"
      ],
      isPublished: true
    });
    expect(res.status).toEqual(201);
  });

  // Authenticated post request
  it("should try to get the list of owners and all tags and succeed", async () => {
    let res = await request(app)
      .get("/template/tag");
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("ownedTags");
    expect(res.body).toHaveProperty("allTags");
    expect(res.body.ownedTags).toHaveLength(2);
    expect(res.body.ownedTags).toContain("Weather");
    expect(res.body.ownedTags).toContain("Contosa");
    expect(res.body.allTags).toHaveLength(1);
    expect(res.body.allTags).toContain("Contosa");
  });
  
});

describe("Preview Templates", () => {
  let token: string;
  const app = express();
  let id: string;

  beforeAll(async () => {
    // TODO: request access token for registered AD app
    // token = "<INSERT_APP_TOKEN_HERE>";
    token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSJ9.eyJhdWQiOiIyZTdhYzNmYS1lMTk4LTQ4YmQtYmI2Ny0yZTQzYWU3ZWViMzAiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE1ODIyMjY0ODIsIm5iZiI6MTU4MjIyNjQ4MiwiZXhwIjoxNTgyMjMwMzgyLCJhaW8iOiI0Mk5nWURpOXRmT2FVcVVSZTFiNHp2RFplaVVIQUE9PSIsImF6cCI6IjJlN2FjM2ZhLWUxOTgtNDhiZC1iYjY3LTJlNDNhZTdlZWIzMCIsImF6cGFjciI6IjEiLCJvaWQiOiIyOGVkOGFmYy04ODNiLTRmZDAtYmZjOC1kYWU3NGZkOGFiYjciLCJzdWIiOiIyOGVkOGFmYy04ODNiLTRmZDAtYmZjOC1kYWU3NGZkOGFiYjciLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1dGkiOiJTM1V4NjQ3NzhVNlhjaDM4NFpzRUFBIiwidmVyIjoiMi4wIn0.sCaGHe9m7eAyzFAPOA1ghuB6stZnGGWFwkS-0dI90hcZRXkylpiyEAHJBEym9xonZA-hIisvE5fX8gfpIVe9Jz1WwIpR47FY4Jh54Gmm84wBXobl9N33MiSA7Et6oKBzgRCZwnPmbiJd7zNFeLgD3gm-Q5Kq3bDkbyU4CFpleEGnHbCpD3yaR4q0meUQEx2-8Mu7yeLVbHaNYhMx6IGogiFRJov_07KMCgPOes1kiMRseddGg_2ARZjz51j3cOVQ4otqBHYtljaea1tyjlNeg6boy0jGVfzrvDvf-RnQ6bD2M1emv9uCB3_t0z8LHsLzyJ8BjOt0srFvy15keo6kKw";
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
        template: "{}",
        version: "1.2",
        isShareable: true
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("id");
    id = res.body.id;
    
    res = await request(app)
      .get(`/template/${id}/preview?version=1.2`)
    expect(res.body).toHaveProperty("template");
    let template = res.body.template;
    expect(template).toHaveProperty("_id");
    expect(template).toHaveProperty("name");
    expect(template).toHaveProperty("owner");
    let owner = template.owner;
    expect(owner).toHaveProperty("firstName");
    expect(owner).toHaveProperty("lastName");
    expect(owner).toHaveProperty("team");
    expect(owner).toHaveProperty("org");
    expect(template).toHaveProperty("instance");
    let instance = template.instance;
    expect(instance).toHaveProperty("version");
    expect(instance.version).toEqual("1.2");
    expect(instance).toHaveProperty("json");
    expect(instance).toHaveProperty("state");
    expect(instance.state).toEqual("draft");
    expect(template).toHaveProperty("tags");
  });

  it("should try to get posted template preview without passing version and fail", async () => {
    const res = await request(app)
      .get(`/template/${id}/preview`)
    expect(res.status).toEqual(404);
  });

  it("should try to get posted template preview of un-shareable template version and fail", async () => {
    let res = await request(app)
      .post("/template")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: "{}",
        version: "1.0",
        isShareable: false
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("id");
    id = res.body.id;

    res = await request(app)
      .get(`/template/${id}`);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("templates");
    expect(res.body.templates).toHaveLength(1);
    let template = res.body.templates[0];
    expect(template.instances).toHaveLength(1);
    expect(template.instances[0]).toHaveProperty("isShareable");
    expect(template.instances[0].isShareable).toEqual(false);

    res = await request(app)
      .get(`/template/${id}/preview?version=1.0`);
    expect(res.status).toEqual(404);
  });
});

describe("Delete Templates", () => {
  let token: string;
  const app = express();
  let id: string;

  beforeAll(async () => {
    // TODO: request access token for registered AD app
    // token = "<INSERT_APP_TOKEN_HERE>";
    token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSJ9.eyJhdWQiOiIyZTdhYzNmYS1lMTk4LTQ4YmQtYmI2Ny0yZTQzYWU3ZWViMzAiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE1ODIyMjY0ODIsIm5iZiI6MTU4MjIyNjQ4MiwiZXhwIjoxNTgyMjMwMzgyLCJhaW8iOiI0Mk5nWURpOXRmT2FVcVVSZTFiNHp2RFplaVVIQUE9PSIsImF6cCI6IjJlN2FjM2ZhLWUxOTgtNDhiZC1iYjY3LTJlNDNhZTdlZWIzMCIsImF6cGFjciI6IjEiLCJvaWQiOiIyOGVkOGFmYy04ODNiLTRmZDAtYmZjOC1kYWU3NGZkOGFiYjciLCJzdWIiOiIyOGVkOGFmYy04ODNiLTRmZDAtYmZjOC1kYWU3NGZkOGFiYjciLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1dGkiOiJTM1V4NjQ3NzhVNlhjaDM4NFpzRUFBIiwidmVyIjoiMi4wIn0.sCaGHe9m7eAyzFAPOA1ghuB6stZnGGWFwkS-0dI90hcZRXkylpiyEAHJBEym9xonZA-hIisvE5fX8gfpIVe9Jz1WwIpR47FY4Jh54Gmm84wBXobl9N33MiSA7Et6oKBzgRCZwnPmbiJd7zNFeLgD3gm-Q5Kq3bDkbyU4CFpleEGnHbCpD3yaR4q0meUQEx2-8Mu7yeLVbHaNYhMx6IGogiFRJov_07KMCgPOes1kiMRseddGg_2ARZjz51j3cOVQ4otqBHYtljaea1tyjlNeg6boy0jGVfzrvDvf-RnQ6bD2M1emv9uCB3_t0z8LHsLzyJ8BjOt0srFvy15keo6kKw";
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
        template: "{}"
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("id");
    id = res.body.id;

    res = await request(app)
      .delete(`/template/${id}`);
    expect(res.status).toEqual(204);

    res = await request(app)
      .get(`/template/${id}`);
    expect(res.status).toEqual(404);
  });
})