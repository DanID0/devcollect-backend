import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UserService } from '../user/user.service.js';
import { LocalStrategy } from './strategies/local.strategy.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { SessionSerializer } from './serializers/session.serializer.js';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PrismaModule, PassportModule.register({session:true})],
  controllers: [AuthController],
  providers: [AuthService, UserService, LocalStrategy, SessionSerializer],
})
export class AuthModule {}
