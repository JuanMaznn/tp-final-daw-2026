import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module.js';
import { ClinicaModule } from './modules/clinica/clinica.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true}),
    AuthModule,
    ClinicaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
