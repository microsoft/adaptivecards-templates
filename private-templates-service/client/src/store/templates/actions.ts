import { REQUEST_TEMPLATES, RECEIVE_TEMPLATES, FAIL_GET, TemplateAction } from "./types";
import { TemplateApi, TemplateList } from 'adaptive-templating-service-typescript-node';
import { IncomingMessage } from "http";


export function requestTemplates(): TemplateAction {
  return {
    type: REQUEST_TEMPLATES
  }
}

export function receiveTemplates(templates: TemplateList): TemplateAction {
  return {
    type: RECEIVE_TEMPLATES,
    cards: templates
  }
}

export function failGet(error: IncomingMessage): TemplateAction {
  return {
    type: FAIL_GET,
    error: error
  }
}

export function getTemplates() {
  return function (dispatch: any) {
    dispatch(requestTemplates())
    var api = new TemplateApi()
    var bearer_auth = api.setApiKey(0, "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSJ9.eyJhdWQiOiI0ODAzZjY2YS0xMzZkLTQxNTUtYTUxZS02ZDk4NDAwZDU1MDYiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE1ODE0NzAxMDYsIm5iZiI6MTU4MTQ3MDEwNiwiZXhwIjoxNTgxNDc0MDA2LCJhaW8iOiI0Mk5nWUtqNDUzd3dLdjFQbTE3KysyMEsxNnd1QVFBPSIsImF6cCI6IjQ4MDNmNjZhLTEzNmQtNDE1NS1hNTFlLTZkOTg0MDBkNTUwNiIsImF6cGFjciI6IjEiLCJvaWQiOiI4Yzg1ZjgwNi03MDA1LTRlY2QtOGYxZS1kMWY3ODRmNThiOWMiLCJzdWIiOiI4Yzg1ZjgwNi03MDA1LTRlY2QtOGYxZS1kMWY3ODRmNThiOWMiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1dGkiOiJxcjRDdVI4LUlFdWZ4eUE0Q3VZZkFBIiwidmVyIjoiMi4wIn0.MsCIvnouCP30Oto72KaFKfew7kA5bfvkrs1P9RJhw_qYFPNFR4cJ-m3q4oEVc0Iy0fjml6qiUatPF6cQJW-dy8gghtZaUaju_oDd4kCpeRZEZt2JO9ew_n0F3o8Qfsd8QrlkVPxmCL6iL0ih3jSYHqzvvf7eMR4RyfwkX_o-j5jZkOCfTqDt2lh27LrLDPiyfQIwvALiHoX7xDTe7R6-1JRfrqa6MgHchtkeJex0pDdU8LXDUVJlR1KY62tdl7vNxY8z9KoZrSV4Kv1wZpMwCi5tfHt6cfYU5-8pHVbrydyzdfPqAnWgUtgcBDCR2i3Dg-z_L0RE8Ao6sPrr742KRA");
    return api.templateGet()
      .then(response => {
        if (response.response.statusCode && response.response.statusCode == 200) {
          dispatch(receiveTemplates(response.body))
        } else {
          dispatch(failGet(response.response))
        }
      })
  }
}