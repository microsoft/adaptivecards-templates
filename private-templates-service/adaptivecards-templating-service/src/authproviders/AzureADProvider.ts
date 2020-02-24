import { AuthenticationProvider } from "./IAuthenticationProvider";
import jws, { Algorithm, Signature } from "jws";
import axios from "axios";
import { AuthIssuer } from "../models/models";

/**
 * @class
 * Class representing authentication with Azure AD
 * @extends AuthenticationProvider
 */
export class AzureADProvider implements AuthenticationProvider {
  public issuer: AuthIssuer = AuthIssuer.AzureAD;
  private user: string = "";
  private static CERT_URL: string = "https://login.microsoftonline.com/common/discovery/keys";

  async isValid(accessToken: string): Promise<boolean> {
    let bearer = accessToken.split(/[ ]+/).pop();
    if (bearer) {
      accessToken = bearer;
    }

    let decodedToken: Signature = jws.decode(accessToken);
    if (!decodedToken) {
      return false;
    }

    let algorithm: Algorithm = decodedToken.header.alg;
    let kid: string | undefined = decodedToken.header.kid;

    if (!kid) {
      return false;
    }

    // Verify signature of access token
    let response = await axios.get(AzureADProvider.CERT_URL);
    let result = false;
    for (const key of response.data.keys) {
      if (key.kid === kid) {
        const cert = "-----BEGIN CERTIFICATE-----\n" + key.x5c[0] + "\n-----END CERTIFICATE-----";
        result = jws.verify(accessToken, algorithm, cert);
        break;
      }
    }
    if (result) {
      this.user = decodedToken.payload.oid;
    }
    return result;
  }

  public getOwner(): string | undefined {
    if (this.user.length === 0) {
      return undefined;
    }
    return this.user;
  }
}
