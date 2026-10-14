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

@Module({
    imports: [
        TypeOrmModule.forFeature([Usuario, Reserva, Medico])
    ],
    controllers: [MedicosController, UsuarioController, AdminController],
    providers: [MedicoService, ReservasService],
    exports: [ReservasService, MedicoService]
})
export class ClinicaModule{

}