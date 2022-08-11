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

  async login(user) {
    const data = await this.repositoryService.findByEmail(user.email);
    const payload = { sub: data.id, email: user.email };
    const tokens = {
      token: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '15m',
      }),
    };

    (await this.repositoryService.updateRefreshToken(
      user.id,
      tokens.refreshToken,
    )) && this.repositoryService.updateToken(user.id, tokens.token);

    return tokens;
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
    const payload = { sub: user.id, email: user.email };
    const tokens = {
      token: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '15m',
      }),
    };
    (await this.repositoryService.updateRefreshToken(
      user.id,
      tokens.refreshToken,
    )) && this.repositoryService.updateToken(user.id, tokens.token);
    return tokens;
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
}
