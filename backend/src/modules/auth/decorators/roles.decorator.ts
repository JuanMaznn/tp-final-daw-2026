import { SetMetadata } from "@nestjs/common";
import { RolesUsuariosEnum } from "../enums/roles-usuarios.enum.js";

export const ROLES_KEY = "roles";

// Uso: @Roles(RolesUsuariosEnum.PACIENTE) sobre un controller o un método.
// Solo guarda en la ruta qué roles pueden entrar; el que decide es RolesGuard.
export const Roles = (...roles: RolesUsuariosEnum[]) => SetMetadata(ROLES_KEY, roles);
