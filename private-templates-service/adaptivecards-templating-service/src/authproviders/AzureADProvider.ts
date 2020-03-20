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
  public token: string;
  private static CERT_URL: string = "https://login.microsoftonline.com/common/discovery/keys";

  async isValid(token?: string): Promise<boolean> {
    let accessToken: string = token || this.token;
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

    // Check aud of token matches the client ID of env app
    result = "#{CLIENT_ID_TOKEN}#" === decodedToken.payload.aud;

    return result;
  }

  public getAuthIDFromToken(token: string): string {
    let decodedToken: Signature = jws.decode(token);
    return decodedToken.payload.oid;
  }

  public constructor(token?: string) {
    this.token = token || "";
  }
}
