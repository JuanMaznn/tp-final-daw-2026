import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Usuario } from "../../clinica/entities/usuarios.entity.js";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { LoginDTO } from "../dtos/input/login.dto.js";
import { EstadosUsuarios } from "../enums/estados-usuarios.enum.js";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcrypt';
import { EstadosReservasEnum } from "../../clinica/enums/estados-reservas.enum.js";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioR: Repository<Usuario>,
        private readonly jwtService: JwtService
    ) { }

    async login(dto: LoginDTO): Promise<{ accessToken: string }> {
        const hashGenerado = bcrypt.hashSync('12345678', 10);
        console.log(">>> COPIA ESTE HASH EXACTO:", hashGenerado);
        const usuario = await this.usuarioR.findOne({
            where: {
                nombres: dto.nombre,
                estadosUsuarios: EstadosUsuarios.ACTIVO
            }
        });

        if (!usuario) {
            throw new UnauthorizedException("Usuario no encontrado o inactivo");
        }

        // 🔎 Agrega estos console.log para depurar en tu terminal
        console.log("Clave recibida del DTO:", dto.clave);
        console.log("Clave (hash) en la Base de Datos:", usuario.clave);

        const isPasswordValid = bcrypt.compareSync(dto.clave, usuario.clave);
        console.log("¿La contraseña coincide?:", isPasswordValid);

        if (!bcrypt.compareSync(dto.clave, usuario.clave)) {
            throw new UnauthorizedException("Credenciales inválidas");
        }
        const payload = { nombres: usuario.nombres, sub: usuario.id };

        return {
            accessToken: this.jwtService.sign(payload)
        };
    }

    
}