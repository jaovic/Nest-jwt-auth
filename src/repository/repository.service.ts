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
      delete user.password &&
        delete user.token &&
        delete user.Refresh_Token &&
        delete user.code;
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
      return await prisma.user.updateMany({
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
      return await prisma.user.updateMany({
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
            not: 'null',
          },
        },
        data: {
          Refresh_Token: 'null',
        },
      });
      await prisma.user.updateMany({
        where: {
          id: userId,
          token: {
            not: 'null',
          },
        },
        data: {
          token: 'null',
        },
      });
      return true;
    } catch (error) {
      throw new Error(`Prisma Error: ${error}`);
    }
  }

  async saveCode(id: string, code: string) {
    try {
      return await prisma.user.updateMany({
        where: {
          id,
        },
        data: {
          code,
        },
      });
    } catch (error) {
      throw new Error(`Prisma Error: ${error}`);
    }
  }

  async verifyCode(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (user.code === 'null') {
        return false;
      }
      return true;
    } catch (error) {
      throw new Error(`Prisma Error: ${error}`);
    }
  }

  async updateCode(id: string) {
    try {
      return await prisma.user.updateMany({
        where: {
          id,
        },
        data: {
          code: 'verificated',
          isVerified: true,
        },
      });
    } catch (error) {
      throw new Error(`Prisma Error: ${error}`);
    }
  }
}
