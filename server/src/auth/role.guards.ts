// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
//
// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}
//
//   canActivate(context: ExecutionContext): boolean {
//     const requiredRoles = this.reflector.get<string[]>(
//       'roles',
//       context.getHandler(),
//     );
//     if (!requiredRoles) {
//       return true;
//     }
//
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//     const { user } = context.switchToHttp().getRequest();
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//     return requiredRoles.includes(user?.role);
//   }
// }

// import { CanActivate, ExecutionContext } from '@nestjs/common';
//
// export class RoleGuard implements CanActivate {
//   constructor(private role: string) {}
//
//   canActivate(context: ExecutionContext): boolean {
//     const request = context.switchToHttp().getRequest();
//     return request.user?.role === this.role;
//   }
// }

// import {
//   Injectable,
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
// } from '@nestjs/common';
// import { User } from '../users/entities/user.entity';
// import { Request } from 'express';
//
// @Injectable()
// export class RoleGuard implements CanActivate {
//   constructor(private requiredRole: string) {}
//
//   canActivate(context: ExecutionContext): boolean {
//     const request: Request = context.switchToHttp().getRequest();
//     const user = request.user as User;
//
//     if (!user) {
//       throw new ForbiddenException('User not authenticated');
//     }
//
//     if (!user.roles.find((role) => this.requiredRole === role.name)) {
//       throw new ForbiddenException(`Required role: ${this.requiredRole}`);
//     }
//
//     return true; // Пользователь имеет доступ
//   }
// }

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: { userId?: number; email: string; role: string[] };
}

export function RoleGuard(requiredRole: string) {
  return new (class implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

      const user = request.user as unknown as User;

      if (!user) {
        throw new ForbiddenException('User not authenticated');
      }

      if (!user.roles.some((role) => role.name === requiredRole)) {
        throw new ForbiddenException(`Required role: ${requiredRole}`);
      }
      return true;
    }
  })();
}
