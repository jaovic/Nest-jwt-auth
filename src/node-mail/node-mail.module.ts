import { Module } from '@nestjs/common';
import { NodeMailService } from './node-mail.service';

@Module({
  providers: [NodeMailService],
  exports: [NodeMailService],
})
export class NodeMailModule {}
