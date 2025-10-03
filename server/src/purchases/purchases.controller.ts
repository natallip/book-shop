import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { Purchase } from './entities/purchase.entity';
import { AuthenticatedRequest, JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guards';

@Controller('purchases')
@UseGuards(JwtAuthGuard)
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post('checkout')
  async buyFromCart(@Req() req: AuthenticatedRequest) {
    return this.purchasesService.buyFromCart(req?.user?.userId ?? 0);
  }

  // @Get(':purchaseId')
  // async getPurchase(
  //   @Param('purchaseId') purchaseId: number,
  // ): Promise<Purchase | null> {
  //   return this.purchasesService.getPurchase(purchaseId);
  // }

  @Get('user')
  async getUserPurchases(
    @Req() req: AuthenticatedRequest,
  ): Promise<Purchase[]> {
    return this.purchasesService.getUserPurchases(req?.user?.userId ?? 0);
  }

  @UseGuards(JwtAuthGuard, RoleGuard('admin'))
  @Get('all')
  async getAllPurchases() {
    return this.purchasesService.getAllPurchases();
  }
}
