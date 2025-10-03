import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly jwtAccessSecret = process.env.ACCESS_SECRET as string; // 'access_secret'; // Измените на ваш секретный ключ
  private readonly jwtRefreshSecret = process.env.REFRESH_SECRET as string; //'refresh_secret'; // Измените на ваш секретный ключ

  constructor(private readonly userService: UsersService) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email?.trim());

    if (user && (await argon2.verify(user.password, password))) {
      return user;
    }
    return null;
  }

  generateAccessToken(user: User): string {
    return jwt.sign(
      { userId: user.id, email: user.email, roles: user.roles },
      this.jwtAccessSecret,
      {
        expiresIn: '15m',
      },
    );
  }

  generateRefreshToken(user: User): string {
    return jwt.sign(
      { userId: user.id, email: user.email, roles: user.roles },
      this.jwtRefreshSecret,
      {
        expiresIn: '7d',
      },
    );
  }

  async validateRefreshToken(refreshToken: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(refreshToken, this.jwtRefreshSecret) as User;
      console.log('decoded', decoded);
      return this.userService.findByEmail(decoded.email);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async revokeRefreshToken(userId: number) {
    const user: User | null = await this.userService.findById(userId);
    if (user) {
      user.refreshToken = '';
      await this.userService.updateUser(userId, user);
    }

    //await this.userService.update({ id: userId }, { refreshToken: null });
    console.log(`Refresh token аннулирован для userId: ${userId}`);
  }
}

// import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UsersService } from '../users/users.service';
// import * as argon2 from 'argon2';
// import { User } from '../users/entities/user.entity';
//
// @Injectable()
// export class AuthService {
//   constructor(
//     private readonly usersService: UsersService,
//     private readonly jwtService: JwtService,
//   ) {}
//
//   async register(
//     username: string,
//     email: string,
//     password: string,
//   ): Promise<any> {
//     // const user = await this.usersService.create({ username, email, password });
//     // console.log(user);
//     // return { message: 'User registered successfully' };
//     const hashedPassword = await argon2.hash(password);
//     return this.usersService.createUser({ username, email, password: hashedPassword });
//   }
//
//   // Генерация access и refresh токенов
//   generateTokens(
//     user: User,
//   ): Promise<{ accessToken: string; refreshToken: string }> {
//     const payload = { email: user.email, roles: user.roles };
//     const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
//     const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); // Длительный срок жизни
//
//     return { accessToken, refreshToken };
//   }
//
//   // Обновление refreshToken в базе данных
//   async updateRefreshToken(
//     userId: number,
//     refreshToken: string,
//   ): Promise<void> {
//     const hashedRefreshToken = await argon2.hash(refreshToken);
//     await this.usersService.updateUser(userId, {
//       refreshToken: hashedRefreshToken,
//     });
//   }
//
//   // Верификация refresh-токена
//   async validateRefreshToken(
//     userId: number,
//     refreshToken: string,
//   ): Promise<boolean> {
//     const user = await this.usersService.findById(userId);
//     if (!user || !user.refreshToken) return false;
//     return argon2.verify(user.refreshToken, refreshToken);
//   }
//
//   // Логин пользователя
//   async login(
//     email: string,
//     password: string,
//   ): Promise<{ accessToken: string }> {
//     const user = await this.usersService.findByEmail(email);
//     if (!user || !(await argon2.verify(user.password, password))) {
//       throw new Error('Invalid credentials');
//     }
//
//     const { accessToken, refreshToken } = await this.generateTokens(user);
//     await this.updateRefreshToken(user.id, refreshToken);
//
//     return { accessToken }; // refresh-токен в тело ответа не возвращается
//   }
// }
