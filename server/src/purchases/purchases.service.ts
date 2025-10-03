import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
// import { User } from '../users/entities/user.entity';
// import { Book } from '../books/entities/book.entity';
import { CartService } from '../cart/cart.service';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    private readonly cartService: CartService,
  ) {}

  async buyFromCart(userId: number): Promise<Purchase> {
    const cartItems = await this.cartService.getCartItems(userId);

    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    const purchaseItems = cartItems.map((cartItem) => ({
      book: cartItem.book,
      quantity: cartItem.quantity,
      price: cartItem.book.price * cartItem.quantity,
    }));

    const purchase = this.purchaseRepository.create({
      userId,
      items: purchaseItems,
      totalPrice: cartItems.reduce(
        (total, item) => total + item.price * item.price,
        0,
      ),
    });

    const savedPurchase = await this.purchaseRepository.save(purchase);
    // Очищаем корзину после оформления покупки
    await this.cartService.clearCart(userId);
    return savedPurchase;
  }

  async getUserPurchases(userId: number): Promise<Purchase[]> {
    return this.purchaseRepository.find({
      where: { userId },
      relations: ['items', 'items.book'], // Автоматическая загрузка данных о книгах
    });
  }

  async getPurchase(purchaseId: number): Promise<Purchase | null> {
    return this.purchaseRepository.findOne({
      where: { id: purchaseId },
      relations: ['items', 'items.book'],
    });
  }

  async getAllPurchases(): Promise<
    (Omit<Purchase, 'user'> & { user: string })[]
  > {
    const purchases = await this.purchaseRepository.find({
      relations: ['user', 'items'],
    });
    return purchases.map((purchase) => ({
      ...purchase,
      user: purchase.user.username,
    }));
  }
}
