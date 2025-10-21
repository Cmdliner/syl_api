import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { Role } from "./roles.enum";

export const corsOpts: CorsOptions = {
    methods: ['POST', 'PUT', 'GET', 'PATCH', 'DELETE'],
    exposedHeaders: 'Authorization',
    credentials: true
}

export const UserRole = Object.values(Role);
export const AuthProviders = ['google', 'apple', 'default'] as const;
export const CLOUDINARY = 'cloudinary';
export const PARCEL_STATUS = ['delivered', 'in_transit', 'unassigned'] as const;