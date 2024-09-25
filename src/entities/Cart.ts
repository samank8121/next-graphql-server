import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './User';
import { Product } from './Product';

@Entity()
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @OneToOne(() => User, (user) => user.cart)
  user: User;

  @ManyToMany(() => Product, (product) => product.carts)
  @JoinTable()
  products: Product[]
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
