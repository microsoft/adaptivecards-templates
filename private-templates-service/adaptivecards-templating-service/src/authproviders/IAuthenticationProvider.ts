/**
 * @interface
 * General authenticator provider
 */
export interface AuthenticationProvider {
    /**
     * To get an id that uniquely identifies the user from
     * the access token
     * @returns string - unique id
     */
    getOwner: () => string;

    /**
     * Validate signature of access token
     * @throws error - invalid signature 
     */
    isValid(accessToken: string) : Promise<boolean | undefined>; 
}

