import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      throw new ForbiddenException('Not an admin, huh ?');
    }
    if (request.user.role == 'ADMIN') {
      return true;
    }
    throw new ForbiddenException('Admin access needed');
  }
}
