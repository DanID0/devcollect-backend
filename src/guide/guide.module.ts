import { Module } from '@nestjs/common';
import { GuideService } from './guide.service.js';
import { GuideController } from './guide.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
@Module({
  imports: [PrismaModule],
  controllers: [GuideController],
  providers: [GuideService],
})
export class GuideModule {}
