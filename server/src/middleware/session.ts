import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies?.['refresh_token'] as string;

    if (!refreshToken) return next();

    try {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as {
        userId: number;
        email: string;
        roles: string[];
      };

      const user = await this.usersService.findById(payload.userId);
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;

      if (user) {
        req.user = user;

        // Генерируем новый access token
        const accessToken = this.authService.generateAccessToken(user);

        // Ставим access токен в cookie — можно также передавать его в тело ответа
        res.cookie('access_token', accessToken, {
          httpOnly: true, // 🔐 безопасный
          secure: true, // только по HTTPS
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000, // 15 минут
        });
        // res.json({ accessToken, user: userWithoutPassword });
        // console.log('res', res.cookie);
      }
    } catch (err) {
      console.log(err);
      // просрочен или неверный — ничего не делаем
    }

    next();
  }
}
