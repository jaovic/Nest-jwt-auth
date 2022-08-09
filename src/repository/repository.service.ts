import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaClient } from '@prisma/client';
import { SingUpAuthDto } from 'src/auth/dto/singup-auth.dto';

const prisma = new PrismaClient();

@Injectable()
export class RepositoryService {
  async create(createAuthDto: SingUpAuthDto) {
    try {
      createAuthDto.password = await bcrypt.hash(createAuthDto.password, 10);
      const user = await prisma.user.create({
        data: {
          name: createAuthDto.name,
          email: createAuthDto.email,
          password: createAuthDto.password,
          cpf: createAuthDto.cpf,
        },
      });
      delete user.password && delete user.token && delete user.Refresh_Token;
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }
  async findByEmail(email: string) {
    try {
      return await prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      throw new Error(`Prisma Error: ${error}`);
    }
  }

  async findById(id: string) {
    try {
      return await prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Prisma Error: ${error}`);
    }
  }
  async findByRefreshToken(refreshToken: string) {
    try {
      return await prisma.user.findUnique({
        where: { Refresh_Token: refreshToken },
      });
    } catch (error) {
      throw new Error(`Prisma Error: ${error}`);
    }
  }
  async updateRefreshToken(id: string, refreshToken: string) {
    try {
      return await prisma.user.update({
        where: {
          id,
        },
        data: { Refresh_Token: refreshToken },
      });
    } catch (error) {
      throw new Error(`Prisma Error: ${error}`);
    }
  }

  async updateToken(id: string, token: string) {
    try {
      return await prisma.user.update({
        where: { id },
        data: { token },
      });
    } catch (error) {
      throw new Error(`Prisma Error: ${error}`);
    }
  }
  async logout(userId: string) {
    try {
      await prisma.user.updateMany({
        where: {
          id: userId,
          Refresh_Token: {
            not: null,
          },
        },
        data: {
          Refresh_Token: null,
        },
      });
      return true;
    } catch (error) {
      throw new Error(`Prisma Error: ${error}`);
    }
  }
}
