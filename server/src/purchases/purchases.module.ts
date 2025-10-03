import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { Book } from '../books/entities/book.entity';
import { PurchaseItem } from './entities/purchase-item.entity';
import { CartModule } from '../cart/cart.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase, PurchaseItem, Book]),
    CartModule,
    AuthModule,
    JwtModule,
  ],
  controllers: [PurchasesController],
  providers: [PurchasesService],
  exports: [PurchasesService],
})
export class PurchasesModule {}
