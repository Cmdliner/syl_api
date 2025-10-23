import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { Role } from "../common/enums/roles.enum";
import { DeliveryType, ParcelStatus, ParcelType } from "../common/enums/parcel.enum";
import { RiderAvailability } from "../common/enums/rider.enum";

export const corsOpts: CorsOptions = {
    methods: ['POST', 'PUT', 'GET', 'PATCH', 'DELETE'],
    exposedHeaders: 'Authorization',
    credentials: true
}

export const UserRole = Object.values(Role);
export const AuthProviders = ['google', 'apple', 'default'] as const;
export const CLOUDINARY = 'cloudinary';
export const PARCEL_STATUS = Object.values(ParcelStatus);
export const DELIVERY_TYPE = Object.values(DeliveryType);
export const PARCEL_TYPE = Object.values(ParcelType);
export const RIDER_AVAILABILITY = Object.values(RiderAvailability);