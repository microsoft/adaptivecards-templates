import { TemplateInstance } from "adaptive-templating-service-typescript-node"
import { UTIL_LIVE, UTIL_DRAFT, UTIL_DEPRECATED } from "../assets/strings";

export function capitalizeString(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getStateFromInstance(instance: TemplateInstance): string {
  let stateEnum = instance.state && capitalizeString(instance.state.toString());
  let stateStr = getState(stateEnum);
  return stateStr;

}

export function getState(state?: string): string {
  if (state && state === "Live") {
    return UTIL_LIVE;
  }
  if (state && state === "Deprecated") {
    return UTIL_DEPRECATED;
  }
  return UTIL_DRAFT;
}