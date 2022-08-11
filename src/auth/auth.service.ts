import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SingUpAuthDto } from './dto/singup-auth.dto';
import { RepositoryService } from 'src/repository/repository.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createAuthDto: SingUpAuthDto) {
    const user = await this.repositoryService.findByEmail(createAuthDto.email);

    if (user) {
      throw new HttpException(
        'User already exists',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return await this.repositoryService.create(createAuthDto);
  }

  async login(user: any) {
    const data = await this.repositoryService.findByEmail(user.email);
    return await this.GetTokens(data.id, data.email);
  }

  async logout(id: string) {
    return await this.repositoryService.logout(id);
  }

  async refreshToken(req: any) {
    const user = await this.repositoryService.findByRefreshToken(
      req.headers.authorization.split(' ')[1],
    );
    if (!user) {
      throw new HttpException(
        'Invalid refresh token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return await this.GetTokens(user.id, user.email);
  }

  async validateUser(email: string, password: string) {
    let user;
    try {
      user = await this.repositoryService.findByEmail(email);
    } catch (error) {
      return null;
    }
    const isValid = bcrypt.compare(password, user.password);
    if (!isValid) return null;
    return true;
  }

  async GetTokens(id: string, email: string) {
    const payload = { sub: id, email: email };
    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '15m',
      }),
    ]);
    await this.repositoryService.updateRefreshToken(id, refreshToken);
    await this.repositoryService.updateToken(id, token);
    return { token, refreshToken };
  }
}
