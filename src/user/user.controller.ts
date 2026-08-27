import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { SessionAuthGuard } from '../auth/auth.guard.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { UpdateUserPasswordDto } from './dto/update-userPassword.dto.js';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(SessionAuthGuard)
  @Post('avatar')
  @UseInterceptors(FileInterceptor('image'))
  async postImage(
    @Request() req,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /image\/(png|jpeg|jpg)/,
        })
        .addMaxSizeValidator({
          maxSize: 10000000,
          message: 'Image cannot be more than 10MB',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    image: Express.Multer.File,
  ) {
    return this.userService.uploadAvatar(req.user.id, image);
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }
  @UseGuards(SessionAuthGuard)
  @Patch()
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(req.user.id, updateUserDto);
  }
  @UseGuards(SessionAuthGuard)
  @Patch('password')
  updatePassword(@Request() req, @Body() updatePasswordDto: UpdateUserPasswordDto) {
    return this.userService.changePassword(req.user.id, updatePasswordDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
