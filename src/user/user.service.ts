import { Injectable, ConflictException, } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from '../../generated/prisma/browser.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private prismaService : PrismaService){}
  
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
        throw new ConflictException('Username is already taken');
      }
      throw new ConflictException('Email is already taken');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.prismaService.user.create({
      data: {
        username,
        email,
        passwordHashed: hashedPassword,
      } ,
      select: { id: true, username: true, email: true, avatarUrl: true, role: true }
    });
  }
  findByUsername(username: string){
    return this.prismaService.user.findUnique({
      where: {
        username
      }
    })
  }
  findByEmail(email: string){
    return this.prismaService.user.findUnique({
      where: {
        email
      }
    })
  }
  findById(id: string){
    return this.prismaService.user.findUnique({
      where: {
        id
      },
      select: { id: true, username: true, email: true, avatarUrl: true, role: true }
    })
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
