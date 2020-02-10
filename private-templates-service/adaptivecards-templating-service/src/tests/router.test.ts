import request from "supertest";
import { TemplateServiceClient } from "../index";
import { ClientOptions } from "../IClientOptions";
import { AzureADProvider } from "../authproviders/AzureADProvider";
import express, { Router } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { InMemoryDBProvider } from "../storageproviders/InMemoryDBProvider";

async function getToken(): Promise<string> {
	const axios = require("axios");
	let options = {
		method: "post",
		url:
			"https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token",
		data: {
			grant_type: "client_credentials",
			client_id: "4803f66a-136d-4155-a51e-6d98400d5506",
			client_secret: "Zpn0hluP3qNr.:gk3bx7ddjNhFt/yzP?",
			resource: "4803f66a-136d-4155-a51e-6d98400d5506"
		}
	};

	try {
		const response = await axios(options);
		console.log("here", response);
		return response;
	} catch (error) {
		console.error(error);
		throw new Error();
	}
}

let options: ClientOptions = {
	authenticationProvider: new AzureADProvider(),
	storageProvider: new InMemoryDBProvider()
};

describe("Get endpoints", () => {
	let token: string;
	const app = express();

	beforeAll(async () => {
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
		token = "<INSERT_APP_TOKEN_HERE>";
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
