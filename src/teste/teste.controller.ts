import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('teste')
@UseGuards(AuthGuard('jwt'))
export class TesteController {
  @Get()
  async getHello(): Promise<string> {
    return 'Hello World!';
  }
}
