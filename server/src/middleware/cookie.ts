import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface ExtendedRequest extends Request {
  refreshToken?: string; // Явно добавляем тип для refreshToken
}

@Injectable()
export class CookieMiddleware implements NestMiddleware {
  use(req: ExtendedRequest, res: Response, next: NextFunction) {
    const token: string | undefined = req.cookies?.refresh_token; // Указываем тип explicitly

    console.log('refresh_token', token);
    console.log('cookies', req.cookies);
    if (token) {
      req.refreshToken = token;
    }

    next();
  }
}
