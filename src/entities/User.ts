import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from "typeorm";
import { Cart } from "./Cart";
  
  @Entity()
  export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ unique: true })
    username!: string;
  
    @Column({ unique: true })
    email!: string;
  
    @Column()
    password!: string;
  
    @Column({ nullable: true })
    cartId: string;

    @OneToOne(() => Cart, (cart) => cart.user)
    cart: Cart;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }