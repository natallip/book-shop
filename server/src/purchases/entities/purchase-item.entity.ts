import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Purchase } from './purchase.entity';
import { Book } from '../../books/entities/book.entity';

@Entity('purchase_items')
export class PurchaseItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Purchase, (purchase) => purchase.items)
  purchase: Purchase;

  @ManyToOne(() => Book, { eager: true }) // Eager: автоматическая загрузка информации о книге
  book: Book;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number; // Общая стоимость для количества книг
}
