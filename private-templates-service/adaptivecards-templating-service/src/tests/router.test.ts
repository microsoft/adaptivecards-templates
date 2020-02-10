import request from "supertest";
import { TemplateServiceClient } from "../index";
import { ClientOptions } from "../IClientOptions";
import { AzureADProvider } from "../authproviders/AzureADProvider";
import express, { Router } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { InMemoryDBProvider } from "../storageproviders/InMemoryDBProvider";

async function getToken(): Promise<string> {
	var request = require("request");
	var options = {
		method: "POST",
		url:
			"https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		form: {
			grant_type: "client_credentials",
			client_id: "4803f66a-136d-4155-a51e-6d98400d5506",
			client_secret: "Zpn0hluP3qNr.:gk3bx7ddjNhFt/yzP?",
			resource: "4803f66a-136d-4155-a51e-6d98400d5506"
		}
	};
	let ans = await request(options, function(
		error: any,
		response: any
	): Promise<string> {
		if (error) throw new Error(error);
		return response.body.access_token;
	});
	return ans;
}

// async function getToken(): Promise<string> {
// 	var myHeaders = new Headers();
// 	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

// 	var urlencoded = new URLSearchParams();
// 	urlencoded.append("grant_type", "client_credentials");
// 	urlencoded.append("client_id", "4803f66a-136d-4155-a51e-6d98400d5506");
// 	urlencoded.append("client_secret", "Zpn0hluP3qNr.:gk3bx7ddjNhFt/yzP?");
// 	urlencoded.append("resource", "4803f66a-136d-4155-a51e-6d98400d5506");

// 	let requestOptions = {
// 		method: "POST",
// 		headers: myHeaders,
// 		body: urlencoded
// 	};

// 	let resp = await fetch(
// 		"https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token",
// 		requestOptions
// 	);
// 	console.log(resp);
// 	return "test";
// 	// .then((response: any) => {
// 	// 	return response.text();
// 	// })
// 	// .then((result: any) => console.log(result))
// 	// .catch((error: any) => console.log("error", error));
// }

let options: ClientOptions = {
	authenticationProvider: new AzureADProvider(),
	storageProvider: new InMemoryDBProvider()
};

describe("Get endpoints", () => {
	let token: string;
	const app = express();

	beforeAll(async () => {
		// TODO: request access token for registered AD app
		// token =
		// 	"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSJ9.eyJhdWQiOiIzOGZhZDdhOS1mZDhjLTQ3Y2MtOWMwYi02YzlmMzE3ODU3NjIiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE1ODEzNTk0MzIsIm5iZiI6MTU4MTM1OTQzMiwiZXhwIjoxNTgxMzYzMzMyLCJhaW8iOiI0Mk5nWUVqb2ZPZTArbUNLc3hmYjl0b1ZTNVptQXdBPSIsImF6cCI6IjM4ZmFkN2E5LWZkOGMtNDdjYy05YzBiLTZjOWYzMTc4NTc2MiIsImF6cGFjciI6IjEiLCJvaWQiOiJjODgyYjI4Yi1lOTNlLTQ5YmYtOGYyYi03ODAzZTFiY2QwMWIiLCJzdWIiOiJjODgyYjI4Yi1lOTNlLTQ5YmYtOGYyYi03ODAzZTFiY2QwMWIiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1dGkiOiJPTjFDWWtxUE8wNmpTcko4dGdaY0FBIiwidmVyIjoiMi4wIn0.M6vsQFSnvCiOdBwEvgq2AV_CfE6v81lNuXcFHYREo8P0A9iaY60wDocJLTNdwDgiYtbQDKyNv8iCbG0o4fQQPqPiMFNY8F024_R_rfYRsufV7egp8smFWMRUBIULn3Qzxvywigu8Zf-iHKgapV4ehXGYewitLGA4KtUHCwpPPhTZykzl1TlG0Wa-H2KrSCeTM69PP09IiPzOBj3WOx_NcpE3wxiOzXW2DdqPg8dt_b_3t3iCWKd318lwj_t9zmzNkB6YqbT90-O_11wDm6qwMj6O4kpky2gLPFE4ytvSm4hRoxm0NtzEQyLxtvWbSh6IeYRc70CkbljO-xA9DNUkZQ";
		token = await getToken();
		console.log("here: ", token);

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
