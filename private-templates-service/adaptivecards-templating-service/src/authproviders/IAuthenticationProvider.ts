import { AuthIssuer } from "../models/models";
/**
 * @interface
 * General authenticator provider
 */
export interface AuthenticationProvider {
  // Issuer and owner fields unique identify every user
  issuer: AuthIssuer;

  /**
   * To get an id that uniquely identifies the user from
   * the access token
   * @returns string or undefined if client is not authenticated
   */
  getOwner: () => string | undefined;

  /**
   * Validate signature of access token and assigns owner.
   * @throws error - invalid signature
   */
  isValid(accessToken: string): Promise<boolean>;
}
