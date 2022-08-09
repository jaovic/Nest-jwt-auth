import { JwtStrategy } from './../auth/strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { TesteService } from './teste.service';
import { TesteController } from './teste.controller';

@Module({
  providers: [TesteService, JwtStrategy],
  controllers: [TesteController],
})
export class TesteModule {}
