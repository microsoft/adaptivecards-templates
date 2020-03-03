import { ShareTemplateAction, REQUEST_SEND_EMAIL, RECEIVE_SEND_EMAIL, FAILURE_SEND_EMAIL } from "./types";
import { RootState } from "../rootReducer";
import { getAuthenticatedClient } from "../../Services/GraphService";
import { requestUserDetailsFailure } from "../auth/actions";
import { requestTemplateFailure } from "../currentTemplate/actions";

function requestSendEmail(): ShareTemplateAction {
  return {
    type: REQUEST_SEND_EMAIL,
    text: "request send email"
  }
}

function receiveSendEmail(): ShareTemplateAction {
  return {
    type: RECEIVE_SEND_EMAIL,
    text: "receive send email"
  }
}

function failureSendEmail(): ShareTemplateAction {
  return {
    type: FAILURE_SEND_EMAIL,
    text: "failure send email"
  }
}

export function shareByEmail(emails: string[], shareURL: string) {
  return function (dispatch: any, getState: () => RootState) {
    const appState = getState();

    if (!appState.auth.accessToken) {
      return dispatch(requestUserDetailsFailure());
    }
    if (!appState.auth.user) {
      return dispatch(requestUserDetailsFailure());
    }
    if (!appState.currentTemplate.template) {
      return dispatch(requestTemplateFailure());
    }

    const client = getAuthenticatedClient(appState.auth.accessToken);

    const sendMail = {
      message: {
        subject: appState.auth.user?.displayName + " shared " + appState.currentTemplate.template.name + " with you",
        body: {
          contentType: "Text",
          content: "Hello,\n\n" + appState.auth.user.displayName + "shared the Adaptive Card Template \"" +
            appState.currentTemplate.template.name + "\" with you.\nYou can access the template at: " +
            shareURL + "\n\nThanks,\nAdaptive Cards Manager"
        },
        toRecipients: [{}]
      },
      saveToSentItems: "false"
    };

    emails.forEach((emailID: string) => sendMail.message.toRecipients.push({
      emailAddress: {
        address: emailID
      }
    }));

    dispatch(requestSendEmail());
    client.api("/me/sendMail").post(sendMail).then((response: any) => {
      if (response.response.statusCode && response.response.statusCode === 202) {
        dispatch(receiveSendEmail());
      }
      else {
        dispatch(failureSendEmail());
      }
    });
  }
}