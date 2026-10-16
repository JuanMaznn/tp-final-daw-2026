import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module.js';
import { ClinicaModule } from './modules/clinica/clinica.module.js';
import { MedicoService } from './modules/clinica/services/medicos.service.js';
import { ReservasService } from './modules/clinica/services/reservas.service.js';
import { Usuario } from './modules/clinica/entities/usuarios.entity.js';
import { Reserva } from './modules/clinica/entities/reservas.entity.js';
import { Medico } from './modules/clinica/entities/medicos.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './modules/auth/services/auth.service.js';

import { LoginController } from './modules/auth/controllers/login.controllers.js';
import { UsuarioController } from './modules/clinica/controllers/usuarios.controllers.js';
import { MedicosController } from './modules/clinica/controllers/medicos.controllers.js';
import { AdminController } from './modules/clinica/controllers/admin.controllers.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'daw',
      password: '2026',
      database: 'clinica_medica',
      entities: [Usuario, Reserva, Medico],
      synchronize: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ClinicaModule,
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule { }
