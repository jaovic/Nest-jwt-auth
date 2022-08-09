import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RepositoryModule } from './repository/repository.module';
import { TesteModule } from './teste/teste.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RepositoryModule,
    AuthModule,
    RepositoryModule,
    TesteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
