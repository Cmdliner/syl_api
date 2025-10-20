import { Role } from '../src/lib/roles.enum';
import { AuthProviders } from '../src/lib/constants';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: Role;
            };
        }
    }
    export type AuthProvider = typeof AuthProviders[number];
    export type JwtPayload = { sub: string; role: Role };

}
export { };