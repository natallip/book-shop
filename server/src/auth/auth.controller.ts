import {Controller, Post, Body, Res, Req, UnauthorizedException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
// import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from './jwt-auth.guard';
// import {RefreshTokenGuard} from "./refresh-token.guard";
//import * as argon2 from "argon2";
//import {JwtAuthGuard} from "./jwt-auth.guard";
//import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  // @UseGuards(JwtAuthGuard)
  // @Post('secure-endpoint')
  // secureEndpoint(@Req() req) {
  //   return { message: 'You have access', user: req.user };
  // }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.usersService.createUser(dto);
    // return { message: 'User registered successfully', user };
    return user;
  }

  // @Post('login')
  // async login(@Body() dto: LoginDto, @Res() res: Response) {
  //   const user = await this.authService.validateUser(dto.email, dto.password);
  //
  //   if (!user) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }
  //
  //   const refreshToken = this.authService.generateRefreshToken(user);
  //
  //   res.cookie('refresh_token', refreshToken, {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: 'strict',
  //     path: '/',
  //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
  //   });
  //
  //   const userWithoutPassword = { ...user };
  //   delete userWithoutPassword.password;
  //
  //   // access_token не нужен — он будет установлен через middleware автоматически
  //   return res.json({ user: userWithoutPassword });
  // },

  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const dto = req.body;
    console.log('dto', dto);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = await this.authService.validateUser(dto.email, dto.password);
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = this.authService.generateAccessToken(user);
    const refreshToken = this.authService.generateRefreshToken(user);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });
    // console.log('res', res.cookie);

    return res.json({ accessToken, user: userWithoutPassword });
  }

  @Post('refresh')
  //@UseGuards(RefreshTokenGuard)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'] as string;
    const user = await this.authService.validateRefreshToken(refreshToken);

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = this.authService.generateAccessToken(user);
    const newRefreshToken = this.authService.generateRefreshToken(user);

    res.cookie('refresh_token', newRefreshToken, { httpOnly: true });
    return res.json({ accessToken: newAccessToken });
  }

  @Post('logout')
  // @UseGuards(AuthGuard)
  async logout(
    @Req() req: AuthenticatedRequest,
    @Res({
      // httpOnly: true,
      //secure: true,
      // sameSite: 'strict',
      passthrough: true,
    })
    res: Response,
  ) {
    await this.authService.revokeRefreshToken(req?.user?.userId ?? 0);
    res.clearCookie('refresh_token');
    return { message: 'Logout successful' };
  }
}

// import { Controller, Post, Body, Res, HttpCode } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import {RegisterDto} from "./dto/register.dto";
// // import { LocalAuthGuard } from './local-auth.guard';
//
// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}
//
//   @Post('register')
//   async register(@Body() dto: RegisterDto) {
//     const user = await this.usersService.create({ ...dto, role: 'user' });
//     return { message: 'User registered successfully' };
//   }
//   // async register(
//   //   @Body() body: { username: string; password: string; email: string },
//   // ) {
//   //   this.authService.register(body.username, body.password, body.email);
//   // }
//
//   @Post('login')
//   @HttpCode(200)
//   async login(
//     @Body() body: { email: string; password: string },
//     @Res({ passthrough: true }) response: Response, // Позволяет установить cookie
//   ) {
//     const { accessToken } = await this.authService.login(
//       body.email,
//       body.password,
//     );
//
//     // Устанавливаем refresh-токен в HTTP-only cookie
//     const user = await this.authService.findByEmail(body.email);
//     const { refreshToken } = await this.authService.generateTokens(user);
//
//     response.cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       secure: true, // Только через HTTPS
//       sameSite: 'strict', // Запрещает отправку cookie третьим сторонам
//       path: '/', // Доступ к куке на всем сайте
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
//     });
//
//     return { accessToken };
//   }
//
//   @Post('refresh')
//   @HttpCode(200)
//   async refreshTokens(
//     @Body() body: { userId: number },
//     @Res({ passthrough: true }) response: Response,
//   ): Promise<{ accessToken: string }> {
//     const { userId } = body;
//     const refreshToken = response.req.cookies['refreshToken']; // Чтение куки
//     const isValid = await this.authService.validateRefreshToken(
//       userId,
//       refreshToken,
//     );
//     if (!isValid) {
//       throw new Error('Invalid refresh token');
//     }
//
//     const user = await this.authService.findById(userId);
//     const tokens = await this.authService.generateTokens(user);
//     await this.authService.updateRefreshToken(user.id, tokens.refreshToken);
//
//     // Обновляем refresh-токен в куке
//     response.cookie('refreshToken', tokens.refreshToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'strict',
//       path: '/',
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });
//
//     return { accessToken: tokens.accessToken };
//   }
//
//   @Post('logout')
//   @HttpCode(200)
//   logout(@Res({ passthrough: true }) response: Response) {
//     response.clearCookie('refreshToken');
//     return { message: 'Logged out successfully' };
//   }
// }
