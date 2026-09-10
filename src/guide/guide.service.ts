import { ConflictException, Injectable, Query } from '@nestjs/common';
import { CreateGuideDto } from './dto/create-guide.dto.js';
import { UpdateGuideDto } from './dto/update-guide.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { findGuidesQueryDto } from './dto/find-guides-query.dto.js';

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

  findAll(query: findGuidesQueryDto) {
    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';
    let sortField = '';
    if (query.sortBy === 'title') {
      sortField = 'title';
    } else {
      sortField = 'createdAt';
    }
    return this.prismaService.guide.findMany({
      where: {
        ...(query.categoryId ? { categoryId: query.categoryId } : {}),
        ...(query.tagIds ? { tags: { some: { id: { in: query.tagIds } } } } : {}),
        ...(query.search
          ? {
              OR: [
                { description: { contains: query.search, mode: 'insensitive' } },
                { title: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [
        {
          [sortField]: sortOrder,
        },
      ],
    });
  }

  findGuideById(id: string) {
    return this.prismaService.guide.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        author: {
          select: {
            username: true,
          },
        },
        category: true,
        tags: true,
        quiz: {
          select: {
            questions: {
              select: {
                type: true,
                prompt: true,
                options: {
                  select: {
                    id: true,
                    text: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  update(id: number, updateGuideDto: UpdateGuideDto) {
    return `This action updates a #${id} guide`;
  }

  remove(id: number) {
    return `This action removes a #${id} guide`;
  }
}
