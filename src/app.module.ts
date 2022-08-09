import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RepositoryModule } from './repository/repository.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RepositoryModule,
    AuthModule,
    RepositoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
