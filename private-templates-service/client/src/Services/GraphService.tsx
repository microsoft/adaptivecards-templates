
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthResponse } from 'msal';
// var graph = require("@microsoft/microsoft-graph-client");

function getAuthenticatedClient(accessToken: AuthResponse): Client {
  // Initialize Graph client
  const client = Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done: any) => {
      done(null, accessToken.accessToken);
    }
  });

  return client;
}

export async function getUserDetails(accessToken: AuthResponse) {
  const client = getAuthenticatedClient(accessToken);
  const user = await client.api("/me").get();
  return user;
}

export async function getOrgDetails(accessToken: AuthResponse) {
  const client = getAuthenticatedClient(accessToken);
  const org = await client.api("/organization").get();
  return org;
}
