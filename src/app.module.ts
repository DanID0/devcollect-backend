import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { GuideModule } from './guide/guide.module.js';
import { TagModule } from './tag/tag.module.js';
@Module({
  imports: [AuthModule, UserModule, GuideModule, TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
