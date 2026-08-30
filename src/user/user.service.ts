import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaError } from '../common/utils/prisma-error.js';
import { UserNotFoundException } from '../common/exceptions/user-not-found.exception.js';
import { PrismaService } from '../prisma/prisma.service.js';

import * as bcrypt from 'bcrypt';
import { buffer } from 'stream/consumers';
import { handleUpload } from '../common/cloudinary/cloudinary.js';
import { UpdateUserPasswordDto } from './dto/update-userPassword.dto.js';
import { User } from '../../generated/prisma/browser.js';
import { UserController } from './user.controller.js';
import { hash } from 'crypto';
@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const username = createUserDto.username.trim();

    const email = createUserDto.email.trim().toLowerCase();
    const existing = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
      select: { id: true, username: true, email: true },
    });
    if (existing) {
      if (existing.username === username) {
        throw new BadRequestException('Username was already taken');
      }
      throw new BadRequestException('Email was already taken');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.prismaService.user.create({
      data: {
        username,
        email,
        passwordHashed: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        profileDescription: true,
        avatarUrl: true,
        role: true,
      },
    });
  }
  findByUsername(username: string) {
    return this.prismaService.user.findUnique({
      where: {
        username,
      },
    });
  }
  findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }
  findByUsernameOrEmail(identifier: string) {
    return this.prismaService.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });
  }
  findById(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        profileDescription: true,
        avatarUrl: true,
        role: true,
      },
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const username = updateUserDto.username?.trim();
    const profileDescription = updateUserDto.profileDescription?.trim();
    const email = updateUserDto.email?.trim().toLowerCase();
    const existing = await this.prismaService.user.findFirst({
      where: {
        AND: [{ OR: [{ username }, { email }, { profileDescription }] }, { NOT: { id: id } }],
      },
      select: { id: true, username: true, email: true, profileDescription: true },
    });
    if (existing) {
      if (existing.username === username) {
        throw new ConflictException('Username is already taken');
      }
      throw new ConflictException('Email is already taken');
    }
    try {
      return await this.prismaService.user.update({
        data: {
          ...updateUserDto,
          id: undefined,
        },
        where: {
          id,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new UserNotFoundException(id);
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.UniqueConstraintFailed
      ) {
        throw new ConflictException('This email or username is already taken');
      }
      throw error;
    }
  }
  async uploadAvatar(id: string, image: Express.Multer.File) {
    const b64 = Buffer.from(image.buffer).toString('base64');
    const dataUrl = 'data:' + image.mimetype + ';base64,' + b64;
    const cloudinaryRes = await handleUpload(dataUrl);
    try {
      return await this.prismaService.user.update({
        data: {
          avatarUrl: cloudinaryRes.secure_url,
          id: undefined,
        },
        where: {
          id,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new UserNotFoundException(id);
      }
      throw error;
    }
  }
  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async changePassword(id: string, changePasswordDto: UpdateUserPasswordDto) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    const compareResult = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.passwordHashed,
    );

    if (compareResult == false) {
      throw new BadRequestException('Current password does not match');
    }

    const hashedPasswordNew = await bcrypt.hash(changePasswordDto.newPassword, 10);

    await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        passwordHashed: hashedPasswordNew,
      },
    });
    return {
      message: 'Password updated successfully',
    };
  }
}
