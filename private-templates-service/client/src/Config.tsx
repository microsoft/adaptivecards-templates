import { } from "react"; // Typescripte requires every file to have an import

export default {
  appId: "4803f66a-136d-4155-a51e-6d98400d5506",
  redirectUri: process.env.NODE_ENV === 'development' ?
    "http://localhost:3000" :
    (process.env.REACT_APP_HOST_ENV === 'dev' ?
      'https://adaptivecms.azurewebsites.net/' :
      'https://adaptivecms-stage.azurewebsites.net/'),
  scopes: ["user.read"]
};
