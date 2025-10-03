import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PurchaseItem } from '../../purchases/entities/purchase-item.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ unique: true })
  sku: string;

  @Column({ type: 'int', default: 0 })
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  year: number;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column()
  genre: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CartItem, (cartItem) => cartItem.book)
  cartItems: CartItem[];

  @OneToMany(() => PurchaseItem, (item) => item.book)
  purchaseItems: PurchaseItem[];
}
