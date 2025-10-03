import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthenticatedRequest, JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard) // Применяем защиту ко всем маршрутам
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async addToCart(
    @Req() req: AuthenticatedRequest,
    @Body() body: { bookId: string; quantity: number },
  ) {
    return this.cartService.addToCart(
      req?.user?.userId ?? 0,
      body.bookId,
      body.quantity,
    );
  }

  @Delete(':bookId')
  async removeFromCart(
    @Req() req: AuthenticatedRequest,
    @Param('bookId') bookId: string,
  ) {
    return this.cartService.removeFromCart(req?.user?.userId ?? 0, bookId);
  }

  @Patch(':bookId')
  async updateQuantity(
    @Req() req: AuthenticatedRequest,
    @Param('bookId') bookId: string,
    @Body() body: { quantity: number },
  ) {
    return this.cartService.updateQuantity(
      req?.user?.userId ?? 0,
      bookId,
      body.quantity,
    );
  }

  @Get()
  async getCartItems(@Req() req: AuthenticatedRequest) {
    return this.cartService.getCartItems(req?.user?.userId ?? 0);
  }

  @Delete()
  async clearCart(@Req() req: AuthenticatedRequest) {
    return this.cartService.clearCart(req?.user?.userId ?? 0);
  }
}
