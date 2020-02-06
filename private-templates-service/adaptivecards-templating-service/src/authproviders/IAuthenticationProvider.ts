/**
 * @interface
 * General authenticator provider
 */
export interface AuthenticationProvider {
    /**
     * To get an id that uniquely identifies the user from
     * the access token
     * @returns string or undefined if client is not authenticated
     */
    getOwner:() => string | undefined;

    /**
     * Validate signature of access token and assigns owner. 
     * @throws error - invalid signature 
     */
    isValid(accessToken: string): Promise<boolean>; 
}

