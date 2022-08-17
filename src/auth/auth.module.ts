import { SmsService } from 'src/sms/sms.service';
import { SmsModule } from './../sms/sms.module';
import { RepositoryModule } from './../repository/repository.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { localStrategy } from './strategies/local.strategy';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RepositoryModule,
    SmsModule,
    PassportModule,
    JwtModule.register({
      privateKey: process.env.TOKEN_SECRET,
      signOptions: { expiresIn: '1m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, localStrategy, JwtStrategy, SmsService],
})
export class AuthModule {}
