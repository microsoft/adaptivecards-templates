import { getIdFromToken } from "../utils/AuthUtils";
import { AuthenticationProvider } from "./IAuthenticationProvider";
import jws, { Algorithm, Signature } from "jws";
import axios from "axios";

export class AzureADProvider implements AuthenticationProvider {
    private user : string = "";
    private static CERT_URL : string = "https://login.microsoftonline.com/common/discovery/keys";
    
    public constructor(accessToken : string) {
        this.isValid(accessToken).then(res => {
            if (!res) {
                const err = new Error();
                err.name = "Invalid access token";
                err.message = "Please pass a valid access token issued by Azure Active Directory.";
                throw err;               
            }

        this.user = getIdFromToken(accessToken);
        });
    }

    async isValid(accessToken: string) : Promise<boolean> {
        let decodedToken : Signature = jws.decode(accessToken);
        let algorithm : Algorithm = decodedToken.header.alg;
        let kid : string | undefined = decodedToken.header.kid;

        if (!kid) {
            return false;
        }

        let response = await axios.get(AzureADProvider.CERT_URL);
        for (const key of response.data.keys){
            if (key.kid === kid) {
                const cert = 
                    "-----BEGIN CERTIFICATE-----\n" + 
                    key.x5c[0] + 
                    "\n-----END CERTIFICATE-----";
                return jws.verify(accessToken, algorithm, cert);
            }            
        }
        return false;
    }

    public getOwner () : string {
        return this.user;
    }
}