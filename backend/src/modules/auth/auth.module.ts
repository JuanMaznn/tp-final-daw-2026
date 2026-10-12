import { Module } from '@nestjs/common';
import { LoginController } from './controllers/login.controllers.js';

@Module({
  imports: [],
  controllers: [LoginController],
  providers: [],
})
export class AuthModule {}
