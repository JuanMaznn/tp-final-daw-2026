import { Module } from "@nestjs/common";
import { MedicosController } from "./controllers/medicos.controllers.js";
import { UsuarioController } from "./controllers/usuarios.controllers.js";
import { AdminController } from "./controllers/admin.controllers.js";

@Module({
    imports: [],
    controllers: [MedicosController, UsuarioController, AdminController],
    providers: [],
    exports: []
})
export class ClinicaModule{

}