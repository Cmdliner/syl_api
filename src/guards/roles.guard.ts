import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/lib/roles.decorator";
import { Role } from "src/lib/roles.enum";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private readonly reflector: Reflector) {}

    canActivate(ctx: ExecutionContext) {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            ctx.getHandler(),
            ctx.getClass()
        ]);
        if(!requiredRoles) return true;

        const { user } = ctx.switchToHttp().getRequest();

        return requiredRoles.some(role => user.role == role);
    }
}