import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SingUpAuthDto } from './dto/singup-auth.dto';
import { RepositoryService } from 'src/repository/repository.service';
import { SmsService } from './../sms/sms.service';
// import { NodeMailService } from 'src/node-mail/node-mail.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService, // private readonly nodemailer: NodeMailService,
  ) {}

  async create(createAuthDto: SingUpAuthDto) {
    const user = await this.repositoryService.findByEmail(createAuthDto.email);

    if (user) {
      throw new HttpException(
        'User already exists',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const code = Math.floor(Math.random() * 9000) + 1000;
    const data = await this.repositoryService.create(createAuthDto);
    await this.repositoryService.saveCode(data.id, code.toString());
    await this.smsService.sendSms(createAuthDto.phone, code.toString());
    // await this.nodemailer.sendMail(createAuthDto.email, code.toString());

    return data;
  }

  async login(user: any) {
    const data = await this.repositoryService.findByEmail(user.email);
    if (!data) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const isVerified = await this.repositoryService.verifyCode(data.id);
    if (!isVerified) {
      throw new HttpException('Code not verified', HttpStatus.NOT_FOUND);
    }
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

  async verifyCode(email: string, code: string) {
    const user = await this.repositoryService.findByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.codeSms !== code && user.codeEmail !== code) {
      throw new HttpException('Code not verified', HttpStatus.NOT_FOUND);
    }
    await this.repositoryService.updateCode(user.id);
    return true;
  }
}
