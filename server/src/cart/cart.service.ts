import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Book } from '../books/entities/book.entity';
import { User } from '../users/entities/user.entity';
// import { CartItem } from './cart-item.entity';
// import { Book } from '../books/books.entity';
// import { User } from '../users/users.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async addToCart(
    userId: number,
    bookId: string,
    quantity: number,
  ): Promise<CartItem> {
    console.log('userId', userId)
    const book = await this.bookRepository.findOne({ where: { id: bookId } });

    // console.log(222, book)
    if (!book) {
      throw new Error(`Book with ID ${bookId} not found`);
    }

    const existingCartItem = await this.cartItemRepository.findOne({
      where: { user: { id: userId }, book: { id: bookId } },
    });

    // console.log('existingCartItem', existingCartItem);

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      existingCartItem.price = book.price * existingCartItem.quantity;
      return this.cartItemRepository.save(existingCartItem);
    }

    const cartItem = this.cartItemRepository.create({
      user: { id: userId } as User,
      book,
      quantity,
      price: book.price * quantity,
    });

    // console.log('cartItem', cartItem);
    return this.cartItemRepository.save(cartItem);
  }

  async updateQuantity(
    userId: number,
    bookId: string,
    quantity: number,
  ): Promise<CartItem | null> {
    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book) {
      throw new Error(`Book with ID ${bookId} not found`);
    }
    const cartItem = await this.cartItemRepository.findOne({
      where: { user: { id: userId }, book: { id: bookId } },
    });

    if (!cartItem) {
      throw new Error(
        `Cart item not found for user ${userId} and book ${bookId}`,
      );
    }

    cartItem.quantity = quantity;
    cartItem.price = +book.price * quantity;

    return this.cartItemRepository.save(cartItem);
  }

  async removeFromCart(userId: number, bookId: string): Promise<void> {
    await this.cartItemRepository.delete({
      user: { id: userId },
      book: { id: bookId },
    });
  }

  async getCartItems(userId: number): Promise<CartItem[]> {
    return this.cartItemRepository.find({
      where: { user: { id: userId } },
      relations: ['book'],
    });
  }

  async clearCart(userId: number): Promise<void> {
    await this.cartItemRepository.delete({ user: { id: userId } });
  }
}
