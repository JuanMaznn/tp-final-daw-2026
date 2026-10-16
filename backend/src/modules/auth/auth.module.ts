import { Module } from '@nestjs/common';
import { LoginController } from './controllers/login.controllers.js';
import { AuthService } from './services/auth.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../clinica/entities/usuarios.entity.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario]),
  JwtModule.register({
    secret: 'tu_clave_secreta_super_segura', // Puedes cambiar esto por lo que prefieras
    signOptions: { expiresIn: '1h' },
  }),],
  controllers: [LoginController],
  providers: [AuthService],
})
export class AuthModule { }
