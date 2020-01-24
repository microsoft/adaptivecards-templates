var graph = require('@microsoft/microsoft-graph-client');

function getAuthenticatedClient(accessToken) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done) => {
      done(null, accessToken.accessToken);
    }
  });

  return client;
}

export async function getUserDetails(accessToken) {
  console.log(accessToken);
  const client = getAuthenticatedClient(accessToken);
  const user = await client.api('/me').get();
  return user;
}

export async function getOrgDetails(accessToken) {
  const client = getAuthenticatedClient(accessToken);
  const org = await client.api('/organization').get();
  return org;
}