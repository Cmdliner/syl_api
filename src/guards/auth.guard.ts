import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly jwtService: JwtService) {}

    canActivate(ctx: ExecutionContext): boolean {
        const request = ctx.switchToHttp().getRequest<Request>();
        const [tokenType, authToken] = request.headers.authorization?.split(' ') || [];

        if (tokenType !== "Bearer" || !authToken) return false;

        try {
            const payload = this.jwtService.verify<JwtPayload>(authToken, {
                secret: process.env.JWT_SECRET!,
            });
            request.user = { id: payload.sub, role: payload.role };
        } catch (error) {
            throw new UnauthorizedException({ message: 'Invalid or expired token' });
        }

        return true;
    }
}