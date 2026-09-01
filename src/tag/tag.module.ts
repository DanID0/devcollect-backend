import { Module } from '@nestjs/common';
import { TagService } from './tag.service.js';
import { TagController } from './tag.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
@Module({
  imports: [PrismaModule],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
