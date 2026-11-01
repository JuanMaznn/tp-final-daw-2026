import { Module } from "@nestjs/common";
import { MedicosController } from "./controllers/medicos.controllers.js";
import { UsuarioController } from "./controllers/usuarios.controllers.js";
import { AdminController } from "./controllers/admin.controllers.js";
import { MedicoService } from "./services/medicos.service.js";
import { AdminService } from "./services/admin.service.js";
import { ReservasService } from "./services/reservas.service.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Usuario } from "./entities/usuarios.entity.js";
import { Reserva } from "./entities/reservas.entity.js";
import { Medico } from "./entities/medicos.entity.js";
import { AuthModule } from "../auth/auth.module.js";

@Module({
    imports: [
        TypeOrmModule.forFeature([Usuario, Reserva, Medico, Usuario]),
        AuthModule,
    ],
    controllers: [MedicosController, UsuarioController, AdminController],
    providers: [MedicoService, ReservasService, AdminService],
    exports: [ReservasService, MedicoService]
})
export class ClinicaModule {

}