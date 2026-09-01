import { ConflictException, Injectable } from '@nestjs/common';
import { CreateGuideDto } from './dto/create-guide.dto.js';
import { UpdateGuideDto } from './dto/update-guide.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class GuideService {
  constructor(private prismaService: PrismaService) {}

  async createGuide(id: string, createGuideDto: CreateGuideDto) {
    const tag = createGuideDto.tags.map((tag) => ({ id: tag }));
    return await this.prismaService.guide.create({
      data: {
        ...createGuideDto,
        authorId: id,
        tags: {
          connect: tag,
        },
      },
    });
  }

  findAll() {
    return `This action returns all guide`;
  }

  findOne(id: number) {
    return `This action returns a #${id} guide`;
  }

  update(id: number, updateGuideDto: UpdateGuideDto) {
    return `This action updates a #${id} guide`;
  }

  remove(id: number) {
    return `This action removes a #${id} guide`;
  }
}
