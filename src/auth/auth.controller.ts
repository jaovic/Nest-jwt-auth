import { AuthService } from './auth.service';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SingUpAuthDto } from './dto/singup-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create')
  async singUp(@Body() body: SingUpAuthDto) {
    return await this.authService.create(body);
  }

  @UseGuards(AuthGuard('local'))
  @Post('singup')
  async login(@Body() body: LoginAuthDto) {
    return await this.authService.login(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req: any) {
    return await this.authService.logout(req.user.id);
  }
}
