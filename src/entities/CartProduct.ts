import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cart } from './Cart';
import { Product } from './Product';

@Entity()
export class CartProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  cartId!: number;

  @ManyToOne(() => Cart, (cart) => cart.cartProducts)
  cart!: Cart;

  @Column()
  productId!: number;

  @ManyToOne(() => Product, (product) => product.cartProducts)
  product!: Product;

  @Column({ type: 'int', default: 1 })
  productCount!: number;
}
