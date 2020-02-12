export default async function getToken() {
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

  const request = require("request");

  const endpoint = options.url;
  const requestParams = {
    grant_type: "client_credentials",
    client_id: options.data.client_id,
    client_secret: options.data.client_secret,
    resource: "https://graph.windows.net"
  };
  let callback = function (err: any, response: any, body: any) : any {
    if (err) {
      console.log("error");
    }
    else {
      console.log("Body=" + body);
      let parsedBody = JSON.parse(body);
      if (parsedBody.error_description) {
        console.log("Error=" + parsedBody.error_description);
      }
      else {
        console.log("Access Token=" + parsedBody.access_token);
      }
    }
  }
  let token = await request.post({ url: endpoint, form: requestParams }, callback);
}
