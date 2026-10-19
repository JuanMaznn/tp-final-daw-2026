import { Module } from '@nestjs/common';
import { LoginController } from './controllers/login.controllers.js';
import { AuthService } from './services/auth.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../clinica/entities/usuarios.entity.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard.js';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario]),
  JwtModule.registerAsync({
    inject: [ConfigService],
    global: true,
    useFactory: (configService: ConfigService) => ({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '8h' },
    }),
  }),],
  controllers: [LoginController],
  providers: [AuthService, AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule { }
