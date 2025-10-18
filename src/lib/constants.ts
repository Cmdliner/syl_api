import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export const corsOpts: CorsOptions = {
    methods: ['POST', 'PUT', 'GET', 'PATCH', 'DELETE'],
    exposedHeaders: 'Authorization',
    credentials: true
}


export const UserRole = ['customer', 'courier', 'admin'] as const;
export const AuthProviders = ['google', 'apple', 'default'] as const;