import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Purchase } from '../../purchases/entities/purchase.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';
import { Role } from '../../roles/entities/role.entity';
import * as argon2 from 'argon2';

@Entity('users')
export class User {
  @ApiProperty({ example: '1', description: 'user id' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItems: CartItem[];

  @OneToMany(() => Purchase, (purchase) => purchase.user)
  purchases: Purchase[];

  @Column({ nullable: true })
  refreshToken: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
}
