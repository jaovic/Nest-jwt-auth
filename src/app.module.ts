import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RepositoryModule } from './repository/repository.module';
import { TesteModule } from './teste/teste.module';
import { SmsModule } from './sms/sms.module';
import { NodeMailModule } from './node-mail/node-mail.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RepositoryModule,
    AuthModule,
    RepositoryModule,
    TesteModule,
    SmsModule,
    NodeMailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
