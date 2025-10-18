import { UserRole, AuthProviders, UserRole } from '../src/lib/constants';

declare global {
    export type UserRole = typeof UserRole[number];
    export type AuthProvider = typeof AuthProviders[number];
}
export {};