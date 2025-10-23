import { Types } from 'mongoose';
import { Role } from '../src/common/enums/roles.enum';
import { AuthProviders, PARCEL_STATUS } from '../src/lib/constants';
import { v2 as cloudianryv2, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';


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

    export type CloudinaryV2 = typeof cloudianryv2;
    export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

    export type RequestUser = { id: string; role: Role; }

    export type Longitude = number;
    export type Latitude = number;

    export type MongoId = Types.ObjectId;

}
export { };