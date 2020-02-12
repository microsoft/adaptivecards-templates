import request from "supertest";
import { TemplateServiceClient } from "../index";
import { ClientOptions } from "../IClientOptions";
import { AzureADProvider } from "../authproviders/AzureADProvider";
import express, { Router } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { InMemoryDBProvider } from "../storageproviders/InMemoryDBProvider";
import getToken from "./gettoken";


let options: ClientOptions = {
  authenticationProvider: new AzureADProvider(),
  storageProvider: new InMemoryDBProvider()
};

describe("Get endpoints", () => {
  let token: string;
  const app = express();

  beforeAll(async () => {
    getToken();
    token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSIsImtpZCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLndpbmRvd3MubmV0IiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3LyIsImlhdCI6MTU4MTQ2MDM2MSwibmJmIjoxNTgxNDYwMzYxLCJleHAiOjE1ODE0NjQyNjEsImFpbyI6IjQyTmdZT2pzdTNuUTY4elhXMDRNZkk4azJESkRBQT09IiwiYXBwaWQiOiI0ODAzZjY2YS0xMzZkLTQxNTUtYTUxZS02ZDk4NDAwZDU1MDYiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwib2lkIjoiOGM4NWY4MDYtNzAwNS00ZWNkLThmMWUtZDFmNzg0ZjU4YjljIiwic3ViIjoiOGM4NWY4MDYtNzAwNS00ZWNkLThmMWUtZDFmNzg0ZjU4YjljIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IldXIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3IiwidXRpIjoiRUNwdm1UaFg5a3V5Y09lUzIwOGpBQSIsInZlciI6IjEuMCJ9.eW7SO6X62cqyPJd4ZForc_WnkHl5JHuuTzNJjUUnQAy_y3yWDUVdo9L5da56h1G0fKDZbkaYsbYIPDr7YbkyAzAEhjjLsosfsHJTuwGYeaJG54N0lj02E8UVT6yisRmmcrlrzh2XGrQdEsHjycjrIExP-cuH2e6xewoWrFhxME_Ih8sFGEiJU6BMyellkBQAX9Mzto00THm2HxYcxJaoJCwrr2P-22qkKCMdQaIodEOBhnjIa2qbDxxTsgScWzDgqKYspg4qE9Fsaoev1CEpcgJdL-bJUnftj7_0m0UAU-W_XchJtja7EyTG9Fw9UxXCxmxghZomdNpImQwEMmw60w";
    // "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSJ9.eyJhdWQiOiI0ODAzZjY2YS0xMzZkLTQxNTUtYTUxZS02ZDk4NDAwZDU1MDYiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE1ODEzODUzMjksIm5iZiI6MTU4MTM4NTMyOSwiZXhwIjoxNTgxMzg5MjI5LCJhaW8iOiI0Mk5nWUtqNDUzd3dLdjFQbTE3KysyMEsxNnd1QVFBPSIsImF6cCI6IjQ4MDNmNjZhLTEzNmQtNDE1NS1hNTFlLTZkOTg0MDBkNTUwNiIsImF6cGFjciI6IjEiLCJvaWQiOiI4Yzg1ZjgwNi03MDA1LTRlY2QtOGYxZS1kMWY3ODRmNThiOWMiLCJzdWIiOiI4Yzg1ZjgwNi03MDA1LTRlY2QtOGYxZS1kMWY3ODRmNThiOWMiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1dGkiOiJFQ3B2bVRoWDlrdXljT2VTOEpNSUFBIiwidmVyIjoiMi4wIn0.Wed3j60D5H39mvnu4O18mZGrzYGqvvtjZDERS306yQPZ01qREk5BNWM591j3A9qHvTwg36Cuo9e1eiamUK4tH6xYJPzigmZsbVVfOtSXmXamSBNv4lrj-7B_7cghHKbVzQJrjSZeOi58oy7s-jOl4wDT6OKm8K0MjlPHX4yboAfJhu4dmeMM8pNIdCa7U7omCrVehipjPprw6hIGWzavGlI2Bgo44RZ4QVDSf117uZmmI_MZgdh_e0gylnXBETc03auMzYdk6UYfcTqC1rrWAOqmr3Dw7kkkXbXmDDtKFEitss83_C_VxoZBVKEO13S1IVdnW694B_H3qjmCjAvdpw";

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
    token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSIsImtpZCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLndpbmRvd3MubmV0IiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3LyIsImlhdCI6MTU4MTQ2MDM2MSwibmJmIjoxNTgxNDYwMzYxLCJleHAiOjE1ODE0NjQyNjEsImFpbyI6IjQyTmdZT2pzdTNuUTY4elhXMDRNZkk4azJESkRBQT09IiwiYXBwaWQiOiI0ODAzZjY2YS0xMzZkLTQxNTUtYTUxZS02ZDk4NDAwZDU1MDYiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwib2lkIjoiOGM4NWY4MDYtNzAwNS00ZWNkLThmMWUtZDFmNzg0ZjU4YjljIiwic3ViIjoiOGM4NWY4MDYtNzAwNS00ZWNkLThmMWUtZDFmNzg0ZjU4YjljIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IldXIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3IiwidXRpIjoiRUNwdm1UaFg5a3V5Y09lUzIwOGpBQSIsInZlciI6IjEuMCJ9.eW7SO6X62cqyPJd4ZForc_WnkHl5JHuuTzNJjUUnQAy_y3yWDUVdo9L5da56h1G0fKDZbkaYsbYIPDr7YbkyAzAEhjjLsosfsHJTuwGYeaJG54N0lj02E8UVT6yisRmmcrlrzh2XGrQdEsHjycjrIExP-cuH2e6xewoWrFhxME_Ih8sFGEiJU6BMyellkBQAX9Mzto00THm2HxYcxJaoJCwrr2P-22qkKCMdQaIodEOBhnjIa2qbDxxTsgScWzDgqKYspg4qE9Fsaoev1CEpcgJdL-bJUnftj7_0m0UAU-W_XchJtja7EyTG9Fw9UxXCxmxghZomdNpImQwEMmw60w";
    let templateClient = await TemplateServiceClient.init(options);
    let middleware: Router = templateClient.expressMiddleware();
    app.use(bodyParser.json());
    app.use(middleware);
  });

  // Unauthenticated request
  it("should try to post without authenticating and fail", async () => {
    const res = await request(app)
      .post("/")
      .send({
        template: {},
        isPublished: false
      });
    expect(res.status).toEqual(401);
  });

  // Authenticated post request
  it("should try to post with valid template and succeed", async () => {
    const res = await request(app)
      .post("/")
      .set({ Authorization: "Bearer " + token })
      .send({
        template: "{}",
        isPublished: false
      });
    expect(res.status).toEqual(201);
  });

  // Authenticated post request with invalid template
  it("should try to post with invalid template and fail", async () => {
    const res = await request(app)
      .post("/")
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
