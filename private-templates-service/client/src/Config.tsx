import { } from "react"; // Typescripte requires every file to have an import

export default {
  appId: process.env.NODE_ENV === 'development' ?
    "cc02a0f4-ef1b-4513-a431-9aca7b2f7fca" :
    (process.env.REACT_APP_HOST_ENV === 'dev' ?
      "4803f66a-136d-4155-a51e-6d98400d5506" :
      "ed0125aa-a0c3-48d5-8e2f-cd05d858e7ef"),
  redirectUri: process.env.NODE_ENV === 'development' ?
    "http://localhost:3000" :
    (process.env.REACT_APP_HOST_ENV === 'dev' ?
      'https://adaptivecms.azurewebsites.net/' :
      'https://adaptivecms-stage.azurewebsites.net/'),
  scopes: ["user.read", "user.readbasic.all"]
};
