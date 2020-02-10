import request from "supertest";
import { TemplateServiceClient } from "../index";
import { ClientOptions } from "../IClientOptions";
import { AzureADProvider } from "../authproviders/AzureADProvider";
import express, { Router } from "express";
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import { InMemoryDBProvider } from "../storageproviders/InMemoryDBProvider";

let options: ClientOptions = {
    authenticationProvider: new AzureADProvider(),
    storageProvider: new InMemoryDBProvider(),
}

describe('Get endpoints', () => {
    let token: string;
    const app = express();

    beforeAll(async() => {
        // TODO: request access token for registered AD app
        token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSJ9.eyJhdWQiOiI0ODAzZjY2YS0xMzZkLTQxNTUtYTUxZS02ZDk4NDAwZDU1MDYiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE1ODEzNzM0ODIsIm5iZiI6MTU4MTM3MzQ4MiwiZXhwIjoxNTgxMzc3MzgyLCJhaW8iOiI0Mk5nWUFqWHVIVmhmK1RhdmJ5NldzNnRIQ3R0QUE9PSIsImF6cCI6IjJlN2FjM2ZhLWUxOTgtNDhiZC1iYjY3LTJlNDNhZTdlZWIzMCIsImF6cGFjciI6IjEiLCJvaWQiOiIyOGVkOGFmYy04ODNiLTRmZDAtYmZjOC1kYWU3NGZkOGFiYjciLCJzdWIiOiIyOGVkOGFmYy04ODNiLTRmZDAtYmZjOC1kYWU3NGZkOGFiYjciLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1dGkiOiIzaUY4NktoeVlFV1Z4d2lpLTg4RUFBIiwidmVyIjoiMi4wIn0.FfLhdvgLW013TTzajuCUlmpy57c4gNmSN2iKnHiwDryoCqzs0LFg3-sjG-qEGuNrmL6zKHdx50gaTkwf5cyqkVGmE9u_hmVkVGIIrR3l_AyUHoga5qzS9qyu3mNogRf841HydRGIOhWoaU6F7PaByge1LrBlsR4kHyRp7WM9nSSd-Nzd2XYaJQYnzjhUuzKphyoZdS-kYqGk0c3KKMa1idJXpbQ_xSYoMrzry08rc-ZW7bNABen6WZJw4H-LixK7SKrrj-UNur8-T5xbLVnu3XrCbYrDmPQFo3iNeMirnkYDYJcLf5fVuN1YWiuF3fHag2iWU-xvZIXPlzi5iVGMiw";
        let templateClient = await TemplateServiceClient.init(options);
        let middleware: Router = templateClient.expressMiddleware();
        app.use(middleware);
    })

    // Unauthenticated get request
    it('should try to get the templates without authenticating and fail', async () => {
        const res = await request(app)
            .get('/')
        expect(res.status).toEqual(401);
    })

    // Authenticated get request
    it('should try to get the templates and succeed', async () => {
        const res = await request(app)
            .get('/')
            .set({ Authorization: 'Bearer ' + token })
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('templates');
    })

    afterAll(async() => {
        await mongoose.connection.close();
    })
})

describe('Post Templates', () => {
    let token: string;
    const app = express();

    beforeAll(async() => {
        // TODO: request access token for registered AD app
        token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSJ9.eyJhdWQiOiI0ODAzZjY2YS0xMzZkLTQxNTUtYTUxZS02ZDk4NDAwZDU1MDYiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE1ODEzNzM0ODIsIm5iZiI6MTU4MTM3MzQ4MiwiZXhwIjoxNTgxMzc3MzgyLCJhaW8iOiI0Mk5nWUFqWHVIVmhmK1RhdmJ5NldzNnRIQ3R0QUE9PSIsImF6cCI6IjJlN2FjM2ZhLWUxOTgtNDhiZC1iYjY3LTJlNDNhZTdlZWIzMCIsImF6cGFjciI6IjEiLCJvaWQiOiIyOGVkOGFmYy04ODNiLTRmZDAtYmZjOC1kYWU3NGZkOGFiYjciLCJzdWIiOiIyOGVkOGFmYy04ODNiLTRmZDAtYmZjOC1kYWU3NGZkOGFiYjciLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1dGkiOiIzaUY4NktoeVlFV1Z4d2lpLTg4RUFBIiwidmVyIjoiMi4wIn0.FfLhdvgLW013TTzajuCUlmpy57c4gNmSN2iKnHiwDryoCqzs0LFg3-sjG-qEGuNrmL6zKHdx50gaTkwf5cyqkVGmE9u_hmVkVGIIrR3l_AyUHoga5qzS9qyu3mNogRf841HydRGIOhWoaU6F7PaByge1LrBlsR4kHyRp7WM9nSSd-Nzd2XYaJQYnzjhUuzKphyoZdS-kYqGk0c3KKMa1idJXpbQ_xSYoMrzry08rc-ZW7bNABen6WZJw4H-LixK7SKrrj-UNur8-T5xbLVnu3XrCbYrDmPQFo3iNeMirnkYDYJcLf5fVuN1YWiuF3fHag2iWU-xvZIXPlzi5iVGMiw";
        let templateClient = await TemplateServiceClient.init(options);
        let middleware: Router = templateClient.expressMiddleware();
        let userMiddleware : Router = templateClient.userExpressMiddleware();
        app.use(bodyParser.json());
        app.use("/template", middleware);
        app.use("/user", userMiddleware);
    })

    // Unauthenticated request
    it('should try to post without authenticating and fail', async () => {
        const res = await request(app)
            .post('/template')
            .send({
                template: {},
                isPublished: false,
            })
        expect(res.status).toEqual(401);
    })

    // Authenticated post request
    it('should try to post with valid template and succeed', async () => {
        const res = await request(app)
            .post('/template')
            .set({ Authorization: 'Bearer ' + token })
            .send({
                template: '{}',
                isPublished: false,
            })
        expect(res.status).toEqual(201);

        // User object should also be created
        const userRes = await request(app)
            .get('/user')
            .set({ Authorization: 'Bearer ' + token })
        expect(userRes.status).toEqual(200);
    })

    it('should try to delete existing user and succeed', async () => {
        const res = await request(app)
            .delete('/user')
            .set({ Authorization: 'Bearer ' + token })
        expect(res.status).toEqual(204);
        expect({ user: [] });

        // No more templates under user
        const templateRes = await request(app)
            .get('/template')
            .set({ Authorization: 'Bearer ' + token })
            .send({
                isPublished: false,
            })
            .expect({templates: []});
    })

    // Authenticated post request with invalid template
    it('should try to post with invalid template and fail', async () => {
        const res = await request(app)
            .post('/template')
            .set({ Authorization: 'Bearer ' + token })
            .send({
                template: '{',
                isPublished: false,
            })
        expect(res.status).toEqual(400);
    })

    afterAll(async() => {
        await mongoose.connection.close();
    })
})
