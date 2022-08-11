import { AuthService } from './../auth/auth.service';
import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';

@Module({
  providers: [SmsService, AuthService],
  exports: [SmsService],
})
export class SmsModule {}
