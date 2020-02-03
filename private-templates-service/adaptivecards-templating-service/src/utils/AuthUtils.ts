import jws, { Signature } from 'jws';

/**
 * @function 
 * Retrieves unique user id from the access token issued by any of the 
 * supported auth providers.
 * @param accessToken - undecoded bearer token
 */
export function getIdFromToken(accessToken : string) : string {
    const err = new Error();
    err.name = "Unable to parse access token";

    let decodedToken : Signature = jws.decode(accessToken);

    if (!decodedToken || !decodedToken.payload){
        err.message = "Missing payload";
        throw err;
    }

    let iss : string = decodedToken.payload.iss;

    // Return unique user id given different token issuers
    if (iss.search(/microsoft/i)) {
        return decodedToken.payload.oid;
    } else {
        err.message = "Please use one of the supported auth providers";
        throw err;
    }
} 
