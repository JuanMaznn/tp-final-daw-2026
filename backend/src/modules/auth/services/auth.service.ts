import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Usuario } from "../../clinica/entities/usuarios.entity.js";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { LoginDTO } from "../dtos/input/login.dto.js";
import { EstadosUsuarios } from "../enums/estados-usuarios.enum.js";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioR: Repository<Usuario>,
        private readonly jwtService: JwtService
    ) { }

    async login(dto: LoginDTO): Promise<{ accessToken: string }> {
        const usuario = await this.usuarioR.findOne({
            where: {
                nombres: dto.nombre,
                estadosUsuarios: EstadosUsuarios.ACTIVO
            }
        });

        if (!usuario) {
            throw new UnauthorizedException("Usuario no encontrado o inactivo");
        }

        if (!bcrypt.compareSync(dto.clave, usuario.clave)) {
            throw new UnauthorizedException("Credenciales inválidas");
        }
        const payload = { nombres: usuario.nombres, sub: usuario.id, rol: usuario.rolesUsuarios };

        return {
            accessToken: this.jwtService.sign(payload)
        };
    }
}