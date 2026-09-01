import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto.js';
import { UpdateTagDto } from './dto/update-tag.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}
  async create(createTagDto: CreateTagDto) {
    const name = createTagDto.name.trim().toLowerCase();
    const existing = await this.prisma.tag.findFirst({
      where: {
        name,
      },
      select: { name: true },
    });
    if (existing) {
      throw new BadRequestException('Tag already exists');
    }

    return await this.prisma.tag.create({
      data: {
        name,
      },
    });
  }

  findAll() {
    return this.prisma.tag.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
