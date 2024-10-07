import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartProduct } from './CartProduct';

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

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.product)
  cartProducts!: CartProduct[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
