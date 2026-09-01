import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { GuideService } from './guide.service.js';
import { CreateGuideDto } from './dto/create-guide.dto.js';
import { UpdateGuideDto } from './dto/update-guide.dto.js';
import { SessionAuthGuard } from '../auth/auth.guard.js';
import { AdminGuard } from '../common/guards/admin.guard.js';

@Controller('guide')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}
  @UseGuards(SessionAuthGuard, AdminGuard)
  @Post()
  create(@Request() req, @Body() createGuideDto: CreateGuideDto) {
    return this.guideService.createGuide(req.user.id, createGuideDto);
  }

  @Get()
  findAll() {
    return this.guideService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guideService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGuideDto: UpdateGuideDto) {
    return this.guideService.update(+id, updateGuideDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guideService.remove(+id);
  }
}
