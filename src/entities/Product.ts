import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from './Cart';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  caption!: string;

  @Column({ type: 'decimal' })
  price!: number;

  @Column()
  slug!: string;

  @Column()
  weight!: string;

  @Column()
  rate: number;

  @Column()
  description: string;

  @Column()
  imageSrc: string;

  @ManyToMany(() => Cart, (cart) => cart.products)
  carts: Cart[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
