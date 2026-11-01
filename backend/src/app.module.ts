import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module.js';
import { ClinicaModule } from './modules/clinica/clinica.module.js';
import { MedicoService } from './modules/clinica/services/medicos.service.js';
import { ReservasService } from './modules/clinica/services/reservas.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './modules/auth/services/auth.service.js';

import { LoginController } from './modules/auth/controllers/login.controllers.js';
import { UsuarioController } from './modules/clinica/controllers/usuarios.controllers.js';
import { MedicosController } from './modules/clinica/controllers/medicos.controllers.js';
import { AdminController } from './modules/clinica/controllers/admin.controllers.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false,
      autoLoadEntities: true,
      logging: process.env.DB_LOGGING === 'true',
      logger: 'advanced-console',
    }),
    AuthModule,
    ClinicaModule,
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule { }
