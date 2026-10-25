import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator.js";
import { RolesUsuariosEnum } from "../enums/roles-usuarios.enum.js";

// Se usa DESPUÉS de AuthGuard: @UseGuards(AuthGuard, RolesGuard).
// AuthGuard deja el payload del token en request['usuario'] y este guard lee el rol de ahí.
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const rolesPermitidos = this.reflector.getAllAndOverride<RolesUsuariosEnum[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Si la ruta no tiene @Roles, alcanza con estar logueado.
        if (!rolesPermitidos || rolesPermitidos.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const rol: RolesUsuariosEnum | undefined = request['usuario']?.rol;

        if (!rol || !rolesPermitidos.includes(rol)) {
            throw new ForbiddenException("No tiene permisos para realizar esta operación");
        }
        return true;
    }
}
