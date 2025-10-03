import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';

export interface AuthenticatedRequest extends Request {
  user?: { userId?: number; email: string; role: string[] };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {} // Добавил `readonly` для лучшей практики

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>(); // Уточняем тип `Request`
    const token = request.cookies?.refresh_token as string; // Убедимся, что `cookies` существует

    if (!token) {
      // throw new UnauthorizedException('Access token is missing');
      return false;
    }

    try {
      const payload: User = this.jwtService.verify<User>(token, {
        secret: process.env.REFRESH_SECRET,
      });

      request.user = payload as unknown as AuthenticatedRequest['user'];

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
