import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { PurchaseItem } from './purchase-item.entity';
import { User } from '../../users/entities/user.entity';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @CreateDateColumn()
  purchasedAt: Date;

  @Column()
  totalPrice: number;

  @ManyToOne(() => User, (user) => user.purchases)
  user: User;

  @OneToMany(() => PurchaseItem, (item) => item.purchase, {
    cascade: true,
    eager: true,
  })
  items: PurchaseItem[];
}
