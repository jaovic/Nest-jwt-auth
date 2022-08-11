import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TesteService } from './teste.service';

@Controller('teste')
@UseGuards(AuthGuard('jwt'))
export class TesteController {
  constructor(private readonly testeService: TesteService) {}
  @Get()
  async getHello(): Promise<string> {
    return 'Hello World!';
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('teste')
  @HttpCode(HttpStatus.OK)
  async getTeste() {
    return await this.testeService.teste();
  }
}
