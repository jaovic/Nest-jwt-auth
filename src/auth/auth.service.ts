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
    const payload = { sub: user.id, email: user.email };
    return {
      token: this.jwtService.sign(payload),
    };
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
