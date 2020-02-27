
import { Client, AuthProviderCallback } from '@microsoft/microsoft-graph-client';
import { AuthResponse } from 'msal';
// var graph = require("@microsoft/microsoft-graph-client");

export function getAuthenticatedClient(accessToken: AuthResponse): Client {
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
