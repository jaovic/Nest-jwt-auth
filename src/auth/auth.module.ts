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
    PassportModule,
    JwtModule.register({
      privateKey: process.env.TOKEN_SECRET,
      signOptions: { expiresIn: '20m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, localStrategy, JwtStrategy],
})
export class AuthModule {}
