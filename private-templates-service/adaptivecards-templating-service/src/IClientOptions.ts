import { AuthenticationProvider } from "./authproviders/IAuthenticationProvider";

/**
 * @interface
 * Options for initializing the Template Service Client
 * @property {Function} [storageProvider] - The storage provider instance
 */
export interface ClientOptions {
    // storageProvider : StorageProvider;
    authenticationProvider : AuthenticationProvider;
}