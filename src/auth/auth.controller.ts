import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { UpdateAuthDto } from './dto/update-auth.dto.js';
import { SessionAuthGuard } from './auth.guard.js';
import { LocalAuthGuard } from './local-auth/local-auth.guard.js';
import { request } from 'node:http';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Request() req) {
    return { msg: 'logged in' };
  }

  @UseGuards(SessionAuthGuard)
  @Get('protected')
  getH(@Request() req): string {
    return req.user;
  }

  @Post('logout')
  async logout(@Request() req, @Response() res) {
    req.session.destroy(() => {
      (res.clearCookie('connect.sid', {
        path: '/',
      }),
        res.json({ message: 'Logged out' }));
    });
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
