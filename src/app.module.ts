import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { GuideModule } from './guide/guide.module.js';
import { TagModule } from './tag/tag.module.js';
import { CategoryModule } from './category/category.module.js';
@Module({
  imports: [AuthModule, UserModule, GuideModule, TagModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
