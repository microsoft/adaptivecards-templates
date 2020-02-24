import request from "supertest";
import { TemplateServiceClient } from "../index";
import { ClientOptions } from "../IClientOptions";
import { AzureADProvider } from "../authproviders/AzureADProvider";
import express, { Router } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { InMemoryDBProvider } from "../storageproviders/InMemoryDBProvider";

export default async function getToken(): Promise<string> {
  let options = {
    method: "post",
    url:
      "https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token",
    data: {
      grant_type: "client_credentials",
      client_id: "4803f66a-136d-4155-a51e-6d98400d5506",
      client_secret: "#{CLIENT_SECRET_TOKEN}#",
    }
  };
  const request = require('request-promise');

  const endpoint = options.url;
  const requestParams = {
    grant_type: "client_credentials",
    client_id: options.data.client_id,
    client_secret: options.data.client_secret,
    resource: "https://graph.windows.net"
  };
  return await request.post({ url: endpoint, form: requestParams })
    // put in try catch
    .then((err: any, response: any, body: any) => {
      if (err) {
        let parsedBody = JSON.parse(err);
        return Promise.resolve(parsedBody.access_token);
      }
      else {
        console.log("Body=" + body);
        let parsedBody = JSON.parse(body);
        if (parsedBody.error_description) {
          console.log("Error=" + parsedBody.error_description);
          return Promise.resolve("hi");
        }
        else {
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

describe("Get endpoints", () => {
  let token: string;
  const app = express();

  beforeAll(async () => {
    // TODO: request access token for registered AD app
    token = await getToken();
    let templateClient = await TemplateServiceClient.init(options);
    let middleware: Router = templateClient.expressMiddleware();
    app.use(middleware);
  });

  // Unauthenticated get request
  it("should try to get the templates without authenticating and fail", async () => {
    const res = await request(app).get("/");
    expect(res.status).toEqual(401);
  });

  // Authenticated get request
  it("should try to get the templates and succeed", async () => {
    const res = await request(app)
      .get("/")
      .set({ Authorization: "Bearer " + token });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("templates");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

describe("Post Templates", () => {
  let token: string;
  const app = express();

  beforeAll(async () => {
    // TODO: request access token for registered AD app
    token = await getToken();
    let templateClient = await TemplateServiceClient.init(options);
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
  it("should try to post with valid template and succeed", async () => {
    const res = await request(app)
      .post("/template")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: "{}",
        isPublished: false
      });
    expect(res.status).toEqual(201);

    // User object should also be created
    const userRes = await request(app)
      .get("/user")
      .set({ Authorization: "Bearer " + token });
    expect(userRes.status).toEqual(200);
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
