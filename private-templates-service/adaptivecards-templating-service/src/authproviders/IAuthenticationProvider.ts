import { AuthIssuer } from "../models/models";
/**
 * @interface
 * General authenticator provider
 */
export interface AuthenticationProvider {
  // Issuer and owner fields unique identify every user
  issuer: AuthIssuer;
  token: string;

  /**
   * Gets the unique id that identifies the user from the token.
   * @param accessToken 
   */
  getAuthIDFromToken(accessToken: string): string;
  
  /**
   * Validate signature of access token and assigns owner.
   * @throws error - invalid signature
   */
  isValid(accessToken: string): Promise<boolean>;
}
