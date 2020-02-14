
import { Client, AuthProviderCallback } from '@microsoft/microsoft-graph-client';
import { AuthResponse } from 'msal';
// var graph = require("@microsoft/microsoft-graph-client");

function getAuthenticatedClient(accessToken: AuthResponse): Client {
  // Initialize Graph client
  const client = Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done: AuthProviderCallback): void => {
      done(null, accessToken.accessToken);
    }
  });

  return client;
}

// TODO: Refactor into a class, store this in state to eliminate unneccesary retrievals
export async function getUserDetails(accessToken: AuthResponse) {
  const client = getAuthenticatedClient(accessToken);
  const user = await client.api("/me").get();
  const image = await client.api("/me/photos/240x240/$value").get();
  user.image = URL.createObjectURL(image);
  return user;
}

export async function getOrgDetails(accessToken: AuthResponse) {
  const client = getAuthenticatedClient(accessToken);
  const org = await client.api("/organization").get();
  return org;
}
