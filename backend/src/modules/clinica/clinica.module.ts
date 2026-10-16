import { Module } from "@nestjs/common";
import { MedicosController } from "./controllers/medicos.controllers.js";
import { UsuarioController } from "./controllers/usuarios.controllers.js";
import { AdminController } from "./controllers/admin.controllers.js";
import { MedicoService } from "./services/medicos.service.js";
import { ReservasService } from "./services/reservas.service.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Usuario } from "./entities/usuarios.entity.js";
import { Reserva } from "./entities/reservas.entity.js";
import { Medico } from "./entities/medicos.entity.js";
import { LoginController } from "../auth/controllers/login.controllers.js";
import { AuthService } from "../auth/services/auth.service.js";
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([Usuario, Reserva, Medico, Usuario]),
        JwtModule.register({
            secret: 'tu_clave_secreta_super_segura',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [MedicosController, UsuarioController, AdminController, LoginController],
    providers: [MedicoService, ReservasService, AuthService],
    exports: [ReservasService, MedicoService]
})
export class ClinicaModule {

}