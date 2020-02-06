import { AuthenticationProvider } from ".";
import { StorageProvider } from ".";
/**
 * @interface
 * Options for initializing the Template Service Client
 * @property {Function} [storageProvider] - The storage provider instance
 * @property {Function} [authenticationProvider] - The authentication provider instance
 */
export interface ClientOptions {
    storageProvider: StorageProvider;
    authenticationProvider: AuthenticationProvider;
}
